provider "aws" {
  region  = "eu-west-2"
  profile = "personal"
}

terraform {
  backend "s3" {
    bucket         = "terraform.quanda.ai"
    key            = "production.tfstate"      
    region         = "eu-west-2"
    profile        = "personal"
    encrypt        = true
  }
}

variable "DB_NAME" {
  type = string
}

variable "DB_USERNAME" {
  type = string
}

variable "DB_PASSWORD" {
  type = string
}

resource "aws_security_group" "dragon_road_access" {
  name        = "dragon_road_access"
  description = "Allow SSH inbound traffic from home IP address"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["82.37.52.190/32"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "quanda_db_access" {
  name        = "quanda_db_access"
  description = "Allow traffic from server to the PostgreSQL database"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "server" {
  ami           = "ami-0cfd0973db26b893b"
  instance_type = "t2.small"

  key_name = aws_key_pair.quanda_key.key_name

  vpc_security_group_ids = [aws_security_group.dragon_road_access.id, aws_security_group.quanda_db_access.id]

  user_data = <<-EOF
              #!/bin/bash           
              sudo yum install docker -y
              sudo service docker start
              sudo usermod -aG docker ec2-user
              sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              EOF
}

resource "aws_instance" "debug" {
  ami           = "ami-0e5f882be1900e43b"
  instance_type = "t2.micro"

  key_name = aws_key_pair.quanda_key.key_name

  vpc_security_group_ids = [aws_security_group.dragon_road_access.id, aws_security_group.quanda_db_access.id]
}

resource "aws_key_pair" "quanda_key" {
  key_name   = "quanda_key"
  public_key = file("/home/harry/.ssh/ssh.quanda.ai.pub")
}

resource "aws_eip" "server_eip" {
  instance   = aws_instance.server.id
  domain     = "vpc"
  depends_on = [aws_instance.server]
}

resource "aws_route53_record" "api_record" {
  zone_id = "Z021778017LHE453YOOJZ"  # quanda.ai
  name    = "api.quanda.ai"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.server_eip.public_ip]
}

resource "aws_db_instance" "quanda_db" {
  allocated_storage = 10
  engine = "postgres"
  db_name= var.DB_NAME
  identifier = "quanda-db"
  storage_encrypted = true
  instance_class = "db.t3.micro"
  username = var.DB_USERNAME
  password = var.DB_PASSWORD
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.quanda_db_access.id]
}
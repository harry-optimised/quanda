scp -r $(pwd)/{quanda,nginx,.env.prod,.env.prod.db,.env.prod.proxy-companion,docker-compose.prod.yml} ec2-user@api.quanda.ai:~
ssh ec2-user@api.quanda.ai "docker restart ec2-user-app-1"

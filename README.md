# Deploy to AWS

- Ensure the remote instance is running.
- Copy files with `scp -r $(pwd)/{quanda,nginx,.env.prod,.env.prod.db,.env.prod.proxy-companion,docker-compose.prod.yml} ec2-user@api.quanda.ai:~`
- SSH into it with `ssh ec2-user@api.quanda.ai`
- Once in run `sudo docker-compose -f docker-compose.prod.yml up -d --build` to start.
- Then exec into the running container, and run `python manage.py collectstatic`.

from django.core.checks import Error, register, CheckMessage
from django.conf import settings


@register()
def check_github_settings(app_configs, **kwargs):
    errors = []  
    if not settings.GITHUB_USER:
        errors.append(
            Error(
                "The KOVAX_GITHUB_USER environment variable is not set properly.",
                hint="Set this as an environment variable in the docker-compose.yml file.",
                id='settings.E002',
            )
        )
    if not settings.GITHUB_PAT:
        errors.append(
            Error(
                "The KOVAX_GITHUB_PAT setting is not set.",
                hint="Set this as an environment variable in the docker-compose.yml file.",
                id='settings.E003',
            )
        )
    return errors

@register()
def check_aws_settings(app_configs, **kwargs):
    errors = []
    if not settings.AWS_REGION:
        errors.append(
            Error(
                "The KOVAX_AWS_REGION setting is not set.",
                hint="Set this as an environment variable in the docker-compose.yml file.",
                id='settings.E004',
            )
        )
    if not settings.AWS_ACCESS_KEY_ID:
        errors.append(
            Error(
                "The KOVAX_AWS_ACCESS_KEY_ID setting is not set.",
                hint="Set this as an environment variable in the docker-compose.yml file.",
                id='settings.E005',
            )
        )
    if settings.AWS_SECRET_ACCESS_KEY == '':
        errors.append(
            Error(
                "The KOVAX_AWS_SECRET_ACCESS_KEY setting is not set.",
                hint="Set this as an environment variable in the docker-compose.yml file.",
                id='settings.E006',
            )
        )
    
    return errors

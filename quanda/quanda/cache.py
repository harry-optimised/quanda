from django_redis.cache import RedisCache
import logging

logger = logging.getLogger('quanda')

class LoggingRedisCache(RedisCache):

    def get(self, key, default=None, version=None):
        """Override get method to log cache hits and misses."""

        value = super().get(key, default=default, version=version)
        
        if value == default:
            logger.debug(f"Cache miss for key: {key}")
        
        else: 
            logger.debug(f"Cache hit for key: {key}")
        
        return value

    def set(self, key, value, timeout=300, version=None):
        """Override set method to log cache sets."""
        
        super().set(key, value, timeout=timeout, version=version)
        logger.debug(f"Cache set for key: {key} with timeout: {timeout}")

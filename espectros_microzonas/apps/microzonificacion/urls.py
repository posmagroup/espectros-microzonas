from django.conf import settings
def javascript_settings():
    js_conf = {
        'geoserver_url': settings.GEOSERVER_URL_CLIENT,
    }
    return js_conf

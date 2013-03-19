from django.conf import settings
def javascript_settings():
    js_conf = {
        'geoserver_url': settings.GEOSERVER_URL_CLIENT,
        'geoserver_microzone_layers': settings.GEOSERVER_MICROZONE_LAYERS,
        'parameters_service': settings.PARAMETERS_SERVICE,
    }
    return js_conf

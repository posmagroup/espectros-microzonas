# Create your views here.
from django.views.generic import DetailView, TemplateView

from braces.views import JSONResponseMixin


import requests


GEOSERVER_URL = 'http://190.200.214.201:8080/geoserver/microzonas/wms'


class ProxyHost(TemplateView):
    """
    ProxyHost: Implements a proxy to between the OpenLayers and GeoServer, due to
    HttpRequest limitations.

    Based on the terrible documented code from OpenLayers examples:
    http://trac.osgeo.org/openlayers/browser/trunk/openlayers/examples/proxy.cgi

    """

    """
    """
    def get(self, request, *args, **kwargs):

        payload = {
            'layers': u'microzonas:Microzonas_Amenaza_General',
            'request': u'GetFeatureInfo',
            'version': u'1.1.0',
            'service': u'WMS',
        }

        response = requests.get(GEOSERVER_URL, params=payload)

        #print response.__dict__
        #print response.__dict__['url']

        super(ProxyHost, self).get(request, *args, **kwargs)


class MicrozoneDetail(JSONResponseMixin, DetailView):
    """
    Returns a JSON object containing the information from certain microzone.

    """

    #model = MicrozoneModel

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        context_dict = {
            # get the information from the object
        }

        return self.render_json_response(context_dict)


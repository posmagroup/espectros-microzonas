# Create your views here.
import urllib
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import DetailView, View

from braces.views import JSONResponseMixin


import requests

geoserver_url = getattr(settings, 'GEOSERVER_URL', 'http://localhost:8080/geoserver/microzonas/wms?')


class ProxyHost(View):
    """
    ProxyHost: Implements a proxy to between the OpenLayers and GeoServer, due to
    HttpRequest limitations.

    Based on the terrible documented code from OpenLayers examples:
    http://trac.osgeo.org/openlayers/browser/trunk/openlayers/examples/proxy.cgi

    """

    def get(self, request, *args, **kwargs):
        """
        Redirects the get request to GeoServer.
        The GEOSERVER_URL setting must be declared in settings. Defaults to localhost.

        """
        try:
            print "holis"
            print "Request = %s" % request.GET
            response = requests.get(geoserver_url + urllib.urlencode(request.GET))
            #print request.GET
            print "response = %s" % response.__dict__
            return HttpResponse(response._content)
        except Exception, e:
            print "exception! --> %s" % e


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

# -*- coding: utf-8 -*-

# Create your views here.
import urllib
from django.conf import settings
from django.http import HttpResponse
from django.template.defaultfilters import slugify
from django.views.generic import DetailView, View

from braces.views import JSONResponseMixin
from pyquery import PyQuery as pq

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
            #print "Request = %s" % request.GET
            response = requests.get(geoserver_url + urllib.urlencode(request.GET))
            #print request.GET
            #print "response = %s" % response.content
            pqobj = pq(response.content)
            tb = pqobj('table')
            attribute = tb('td').next().next().html()
            return HttpResponse(attribute)
        except Exception, e:
            print "exception! --> %s" % e


class MicrozoneDetail(JSONResponseMixin, DetailView):
    """
    Returns a JSON object containing the information from certain microzone.

    """

    #model = MicrozoneModel

    def get(self, request, *args, **kwargs):
        attr = self.get_microzone_id(request)
        context_dict = {
            # get the information from the object
        }

        return self.render_json_response(context_dict)

    def get_microzone_id(self, request):
        """
        Redirects the get request to GeoServer.
        The GEOSERVER_URL setting must be declared in settings. Defaults to localhost.

        """
        response = requests.get(geoserver_url + urllib.urlencode(request.GET))
        pqobj = pq(response.content)
        tb = pqobj('table')
        attribute = tb('td').next().next().html()
        attr_slug = slugify(attribute)
        print "attr = %s" % attr_slug
        return attr_slug

# -*- coding: utf-8 -*-

# Create your views here.
import urllib
from django.conf import settings
from django.http import HttpResponse, Http404
from django.template.defaultfilters import slugify
from django.views.generic import DetailView, View

from braces.views import JSONResponseMixin
from django.views.generic.base import TemplateView
from pyquery import PyQuery as pq

import requests
import numpy

from apps.microzonificacion.models import Microzone

from funvisis import htmltable

geoserver_url = settings.GEOSERVER_URL


class LogSpace(JSONResponseMixin, TemplateView):

    def get(self, request, *args, **kwargs):
        arr = numpy.logspace(-6.5, 3.5, num=40, base=2)
        print arr
        return self.render_json_response(list(arr))

class MicrozoneDetail(JSONResponseMixin, DetailView):
    """
    Returns a JSON object containing the information from certain microzone.

    """

    #model = MicrozoneModel

    def get_object(self, **kwargs):
        return Microzone.objects.get(label__iexact=kwargs['label'])

    def get(self, request, *args, **kwargs):
        try:
            attr = self.get_microzone_id(request)
            obj = self.get_object(label=attr)

            context_dict = {
                'name': attr,
                'arg_a0': obj.arg_a0,
                'phi': obj.phi,
                'beta': obj.beta,
                'arg_ta': obj.arg_ta,
                'arg_t0': obj.arg_t0,
                'arg_tstar': obj.arg_tstar,
                'arg_td': obj.arg_td,
                'arg_m': obj.arg_m,
                'arg_p': obj.arg_p
            }

            return self.render_json_response(context_dict)
        except Exception, e:
            print "error = %" % e
            raise Http404
            #return HttpResponse()

    def get_microzone_id(self, request):
        """
        Redirects the get request to GeoServer.
        The GEOSERVER_URL setting must be declared in settings. Defaults to localhost.

        """
        try:
            response = requests.get(geoserver_url + urllib.urlencode(request.GET))
            pqobj = pq(response.content)
            tb = pqobj('table')
            attribute = tb('td').next().next().html()
            return attribute
        except Exception, e:
            print "error = %s" % e



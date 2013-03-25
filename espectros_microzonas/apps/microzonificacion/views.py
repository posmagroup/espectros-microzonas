# -*- coding: utf-8 -*-

from django.http import  Http404
from django.views.generic import DetailView
from braces.views import JSONResponseMixin
from apps.microzonificacion.models import Microzone

class MicrozoneDetail(JSONResponseMixin, DetailView):
    """
    Returns a JSON object containing the information from certain microzone.

    """

    def get_object(self, **kwargs):
        return Microzone.objects.get(label__iexact=kwargs['label'])

    def get(self, request, *args, **kwargs):
        try:
            attr = request.GET['name']
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
            print "error = %s" % e
            raise Http404

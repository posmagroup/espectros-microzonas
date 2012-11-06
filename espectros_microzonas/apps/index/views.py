# Create your views here.

from django.views.generic import TemplateView

class IndexView(TemplateView):
    template_name = "index/index.html"

class SampleView(TemplateView):
    template_name = "index/sample.html"
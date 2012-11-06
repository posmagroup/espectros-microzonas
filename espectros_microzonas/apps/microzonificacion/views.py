# Create your views here.
from django.views.generic import DetailView

from braces.views import JSONResponseMixin


class TestObject():
    def __init__(self, name, msg):
        self.name = name
        self.msg = msg


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

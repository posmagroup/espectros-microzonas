# -*- coding: utf-8 -*-

"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from django.test.client import RequestFactory

class GetMicrozoneTest(TestCase):
    
    def setup(self):
        """
        setup a list of tuples relating known url requests with known values
        returned by the test_known_results function.
        """

        self.factory = RequestFactory()

        url_requests_ids_mapping = [
            ( ,),
        ]
        
    def test_known_results(self):
        """
        Tests known results from known inputs.

        
        """
        self.assertEqual(1 + 1, 2)

# -*- coding: utf-8 -*-

# -*- coding: utf-8 -*-

'''
Syntax:
python -m micro_para_2models

Read a CSV file with a microzone and parameter per row and create a
Microzone in the model Microzona.

The idea is to run this once, then save a fixture backup in json or
whatever.
'''



from django.core.management import setup_environ
from espectros_microzonas import settings
setup_environ(settings)

from apps.microzonificacion.models import Microzone

import csv
import sys

def create_microzone(csv_header, mapping, Microzone_class, args):
    '''
    Use the class ``Microzone_class`` to create a microzone based on
    the arguents in the list ``args``.

    It examine the ``csv_header`` to know what to what param
    correspond each element in the list ``args``. Then ask the mapping
    to know what model field it corresponds.
    '''
    pass


# The csv could have the cols in any order. So we use the file header
# to identify the column rol, and then the csv_micro_map to know what
# Microzone Field we should set.

csv_micro_map = {
    'Microzona': 'label',
    'A_0(g)': 'arg_a0',
    '\\phi': 'phi',
    '\\beta': 'beta',
    'T_A(s)': 'arg_ta',
    'T_0(s)': 'arg_t0',
    'T^*(s)': 'arg_tstar',
    'T_D(s)': 'arg_td',
    'm': 'arg_m',
    'p': 'arg_p',
    }

with open(sys.argv[1], 'r') as csvfile:
    params_reader = csv.reader(csvfile, delimiter=',')
    params = next(params_reader)
    
    for args in params_reader:
        create_microzone(
            csv_header=params,
            mapping=csv_micro_map,
            Microzone_class=Microzone,
            args=args
            )


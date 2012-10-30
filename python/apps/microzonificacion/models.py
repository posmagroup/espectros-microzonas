# -*- coding:utf-8 -*-

from django.db import models

# Create your models here.

class Microzone(models.Model):
    """
    This model represent all the information about a microzone in the database.
    
    Fields:
        name: Name of the microzone.
        slug: Slug to get the query.
        
    Fields from the FUNVISIS argument tables.
        arg_a0: "A_0(g)"
        phi: "\\phi"
        beta: "\\beta"
        arg_ta: "T_A(s)"
        arg_t0: "T_0(s)"
        arg_tstar: "T^*(s)"
        arg_td: "T_D(s)"
        arg_m: "m"
        arg_p: "p"
        
    """
    

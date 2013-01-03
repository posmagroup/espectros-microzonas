# -*- coding:utf-8 -*-

from django.db import models


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
    name = models.CharField(max_length=30)
    label = models.SlugField()

    arg_a0 = models.FloatField()
    phi = models.FloatField()
    beta = models.FloatField()
    arg_ta = models.FloatField()
    arg_t0 = models.FloatField()
    arg_tstar = models.FloatField()
    arg_td = models.FloatField()
    arg_m = models.FloatField()
    arg_p = models.FloatField()

    def m_espectro(self, T):
        return espectro(T,
                        A_0=self.arg_a0, phi=self.phi, beta=self.beta,
                        T_A=self.arg_ta, T_0=self.arg_t0,
                        T_star = self.arg_tstar, T_D=self.arg_td,
                        m=self.arg_m, p = self.arg_p)
    
    def __unicode__(self):
        return "%s" % self.arg_t0
        # return "%s" % self.name

def espectro(T, A_0, phi, beta,
             T_A, T_0, T_star, T_D,
             m, p):
    """
    Espectros elásticos. Modelo de ajuste. Proyecto de
    microzonificación sísmica - Caracas

    Esta función es una implementación del modelo de ajuste que se
    presenta en la sección *"6.4.2 Modelo de ajuste de espectros"* del
    documento del proyecto de microzonificación.
    """
    
    phiA0 = phi*A_0
    if T < T_A:
        return phiA0
    elif T_A <= T < T_0:
        trans = 1 + (T - T_A)/(T_0 - T_A)/(T_0 - T_A)*(beta - 1)
        return phiA0*trans
    else:
        hyp_fall_m = (T_0/T)**m
        phibetaA0 = beta*phiA0
        if T_0 <= T < T_star:
            return phibetaA0*hyp_fall_m
        else:
            hyp_fall_p = (T_star/T)**p
            if T_star <= T < T_D:
                return phibetaA0*hyp_fall_m*hyp_fall_p
            else: # T >= T_D
                pseudo_accel_2 = (T_D/T)**2
                return phibetaA0*hyp_fall_m*hyp_fall_p*pseudo_accel_2

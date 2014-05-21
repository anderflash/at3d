/**
* Classe que será despachada para eventos internos da engine.
* @class ATEvent
* @extends {Event}
* @beta
* @since 0.0.1
*/
function ATEvent()
{
  
}
ATEvent.ERRO = 'erro';
ATEvent.COMPLETO = 'completo';
ATUtils.inherits(ATEvent, Event);
import { combineReducers } from 'redux';
import lobby from '../modules/lobby';
import appstate from '../modules/appstate';
import auth from '../modules/auth';
import tournaments from '../modules/tournaments';
import room from '../modules/room';
import payment from '../modules/payment';
import mygames from '../modules/mygames';
import teams from '../modules/teams';
import players from '../modules/players';
import myteam from '../modules/myteam';
import runtime from '../modules/runtime';
import intl from '../modules/intl';

export default combineReducers({
  [intl.constants.NAME]: intl.reducer,
  [runtime.constants.NAME]: runtime.reducer,
  [lobby.constants.NAME]: lobby.reducer,
  [appstate.constants.NAME]: appstate.reducer,
  [auth.constants.NAME]: auth.reducer,
  [tournaments.constants.NAME]: tournaments.reducer,
  [room.constants.NAME]: room.reducer,
  [payment.constants.NAME]: payment.reducer,
  [mygames.constants.NAME]: mygames.reducer,
  [teams.constants.NAME]: teams.reducer,
  [players.constants.NAME]: players.reducer,
  [myteam.constants.NAME]: myteam.reducer,
});

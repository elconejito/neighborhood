/**
 * Font Awesome
 */
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleUp,
  faAngleDoubleUp,
  faArrowCircleLeft,
  faArrowCircleRight,
  faBars,
  faBed,
  faCircleNotch,
  faFrown,
  faMeh,
  faMinus,
  faPlusCircle,
  faSmile,
  faWeight,
} from '@fortawesome/free-solid-svg-icons'

library.add(faAngleUp);
library.add(faAngleDoubleUp);
library.add(faArrowCircleLeft);
library.add(faArrowCircleRight);
library.add(faBars);
library.add(faBed);
library.add(faCircleNotch);
library.add(faFrown);
library.add(faMeh);
library.add(faMinus);
library.add(faPlusCircle);
library.add(faSmile);
library.add(faWeight);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch();

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
  faEdit,
  faFrown,
  faMeh,
  faMinus,
  faPlusCircle,
  faSmile,
  faTrashAlt,
  faWeight,
} from '@fortawesome/free-solid-svg-icons';

import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(faAngleUp);
library.add(faAngleDoubleUp);
library.add(faArrowCircleLeft);
library.add(faArrowCircleRight);
library.add(faBars);
library.add(faBed);
library.add(faCircleNotch);
library.add(faEdit);
library.add(faFrown);
library.add(faGithub);
library.add(faMeh);
library.add(faMinus);
library.add(faPlusCircle);
library.add(faSmile);
library.add(faTrashAlt);
library.add(faWeight);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch();

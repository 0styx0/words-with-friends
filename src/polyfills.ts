import { polyfill } from 'mobile-drag-drop';

// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';

// options are optional ;)

window.addEventListener( 'touchmove', function() {/* tslint allow empty block */});

polyfill({
    // use this to make use of the scroll behaviour
    dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

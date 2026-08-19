import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldShowStickyTarget } from '../../resources/js/helpers/index.js';

const panelAt = (bottom) => ({
    getBoundingClientRect: () => ({ bottom }),
});

test('shows the sticky target only after the full target panel leaves the viewport', () => {
    assert.equal(shouldShowStickyTarget(panelAt(1), 1280), false);
    assert.equal(shouldShowStickyTarget(panelAt(0), 1280), true);
    assert.equal(shouldShowStickyTarget(panelAt(-1), 1280), true);
});

test('does not show the sticky target without a panel or on a mobile viewport', () => {
    assert.equal(shouldShowStickyTarget(null, 1280), false);
    assert.equal(shouldShowStickyTarget(panelAt(-1), 767), false);
});

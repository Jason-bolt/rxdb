import { randomOfArray } from '../../../plugins/utils';
import { ScrollToSection, SemPage } from '../pages';
import { HeroSection_A } from './hero-section/hero_a';
import { HeroSection_B } from './hero-section/hero_b';
import { HeroSection_C } from './hero-section/hero_c';
import { HeroSection_D } from './hero-section/hero_d';

const CURRENT_TEST_RUN = {
    id: 'T1', // test hero page content type
    variations: {
        A: HeroSection_A,
        B: HeroSection_B,
        C: HeroSection_C,
        D: HeroSection_D
    }
};

export type TestGroup = {
    variation: string;
    deviceType: 'm' | 'd'; // mobile/desktop
    semPageId?: string;
};
let testGroup: TestGroup;

const TEST_GROUP_STORAGE_ID = 'test-group-' + CURRENT_TEST_RUN.id;

export function getTestGroup(semPageId?: string): TestGroup {
    console.log('setTestGroup: ' + semPageId);

    if (testGroup) {
        return testGroup;
    }

    const groupFromStorage = localStorage.getItem(TEST_GROUP_STORAGE_ID);
    if (groupFromStorage) {
        testGroup = JSON.parse(groupFromStorage);
    } else {
        testGroup = {
            variation: randomOfArray(Object.keys(CURRENT_TEST_RUN.variations)),
            deviceType: window.screen.width <= 900 ? 'm' : 'd',
            semPageId: semPageId ? semPageId : ''
        };
        localStorage.setItem(TEST_GROUP_STORAGE_ID, JSON.stringify(testGroup));
    }
    return testGroup;
}

export function ABTestContent(props: {
    sem?: SemPage;
    scrollToSection: ScrollToSection;
}) {
    const variationId = getTestGroup().variation;
    const VariationElement = CURRENT_TEST_RUN.variations[variationId];
    return <VariationElement sem={props.sem} scrollToSection={props.scrollToSection} />;
}


export function getTestGroupEventPrefix() {
    const testGroup = getTestGroup();
    return [
        'abt',
        CURRENT_TEST_RUN.id,
        'E:' + testGroup.semPageId,
        'V:' + testGroup.variation,
        'D:' + testGroup.deviceType
    ].join('_');
}

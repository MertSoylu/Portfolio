import { describe, expect, it } from 'vitest';
import { moodForPath } from '../../src/App';

describe('Signal Field route mood', () => {
  it('maps routes from the route table', () => {
    expect(moodForPath('/')).toBe('home');
    expect(moodForPath('/web')).toBe('area');
    expect(moodForPath('/web/')).toBe('area');
    expect(moodForPath('/android')).toBe('area');
    expect(moodForPath('/cybersecurity')).toBe('area');
    expect(moodForPath('/data-science')).toBe('area');
    expect(moodForPath('/case-study/noble')).toBe('case');
  });

  it('treats unknown routes and unknown case studies as 404', () => {
    expect(moodForPath('/nope')).toBe('notfound');
    expect(moodForPath('/web/extra')).toBe('notfound');
    expect(moodForPath('/case-study/does-not-exist')).toBe('notfound');
  });
});

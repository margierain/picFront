import { PimppicFrontPage } from './app.po';

describe('pimppic-front App', function() {
  let page: PimppicFrontPage;

  beforeEach(() => {
    page = new PimppicFrontPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

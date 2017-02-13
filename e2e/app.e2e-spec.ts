import { AgendaLaNormalPage } from './app.po';

describe('agenda-la-normal App', function() {
  let page: AgendaLaNormalPage;

  beforeEach(() => {
    page = new AgendaLaNormalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

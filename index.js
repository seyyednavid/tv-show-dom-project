test("Check summery section",function(){
    let episode={
        id: 4957,
        url: "http://www.tvmaze.com/episodes/4957/game-of-thrones-1x06-a-golden-crown",
        name: "A Golden Crown",
        season: 1,
        number: 6,
        airdate: "2011-05-22",
        airtime: "21:00",
        airstamp: "2011-05-23T01:00:00+00:00",
        runtime: 60,
        image: {
          medium:
            "http://static.tvmaze.com/uploads/images/medium_landscape/1/2676.jpg",
          original:
            "http://static.tvmaze.com/uploads/images/original_untouched/1/2676.jpg",
        },
        summary:
          "<p>Viserys is increasingly frustrated by the lack of progress towards gaining his crown.</p>",
        _links: {
          self: {
            href: "http://api.tvmaze.com/episodes/4957",
          },
        },
      }
    expect(matchesSearchFilter(episode, "gaining his crown")).toBe(true);
      });
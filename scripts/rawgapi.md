RAWG Video Games Database API (v1.0)
Download OpenAPI specification:Download

The largest open video games database.

Why build on RAWG
More than 350,000 games for 50 platforms including mobiles.
Rich metadata: tags, genres, developers, publishers, individual creators, official websites, release dates, Metacritic ratings.
Where to buy: links to digital distribution services
Similar games based on visual similarity.
Player activity data: Steam average playtime and RAWG player counts and ratings.
Actively developing and constantly getting better by user contribution and our algorithms.
Terms of Use
Free for personal use as long as you attribute RAWG as the source of the data and/or images and add an active hyperlink from every page where the data of RAWG is used.
Free for commercial use for startups and hobby projects with not more than 100,000 monthly active users or 500,000 page views per month. If your project is larger than that, email us at api@rawg.io for commercial terms.
No cloning. It would not be cool if you used our API to launch a clone of RAWG. We know it is not always easy to say what is a duplicate and what isn't. Drop us a line at api@rawg.io if you are in doubt, and we will talk it through.
You must include an API key with every request. The key can be obtained at https://rawg.io/apidocs. If you don’t provide it, we may ban your requests.
Read more.

creator-roles
Get a list of creator positions (jobs).
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Position)
get
/creator-roles
https://api.rawg.io/api/creator-roles
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
creators
Get a list of game creators.
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Person)
get
/creators
https://api.rawg.io/api/creators
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the creator.
path Parameters
id
required
string
Responses
200
Response Schema: application/json
id	
integer (ID)
name
required
string (Name) non-empty
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
image	
string <uri> (Image)
image_background	
string <uri> (Image background) non-empty
description	
string (Description) non-empty
games_count	
integer (Games count)
reviews_count	
integer (Reviews count)
rating	
string <decimal> (Rating)
rating_top	
integer (Rating top)
updated	
string <date-time> (Updated)
get
/creators/{id}
https://api.rawg.io/api/creators/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"slug": "string",
"image": "http://example.com",
"image_background": "http://example.com",
"description": "string",
"games_count": 0,
"reviews_count": 0,
"rating": "string",
"rating_top": 0,
"updated": "2025-04-18T09:25:52Z"
}
developers
Get a list of game developers.
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Developer)
get
/developers
https://api.rawg.io/api/developers
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the developer.
path Parameters
id
required
integer
A unique integer value identifying this Developer.

Responses
200
Response Schema: application/json
id	
integer (ID)
name
required
string (Name) [ 1 .. 100 ] characters
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
games_count	
integer (Games count)
image_background	
string <uri> (Image background) non-empty
description	
string (Description)
get
/developers/{id}
https://api.rawg.io/api/developers/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"slug": "string",
"games_count": 0,
"image_background": "http://example.com",
"description": "string"
}
games
Get a list of games.
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

search	
string
Search query.

search_precise	
boolean
Disable fuzziness for the search query.

search_exact	
boolean
Mark the search query as exact.

parent_platforms	
string
Filter by parent platforms, for example: .1,2,3

platforms	
string
Filter by platforms, for example: .4,5

stores	
string
Filter by stores, for example: .5,6

developers	
string
Filter by developers, for example: or .1612,18893valve-software,feral-interactive

publishers	
string
Filter by publishers, for example: or .354,20987electronic-arts,microsoft-studios

genres	
string
Filter by genres, for example: or .4,51action,indie

tags	
string
Filter by tags, for example: or .31,7singleplayer,multiplayer

creators	
string
Filter by creators, for example: or .78,28cris-velasco,mike-morasky

dates	
string
Filter by a release date, for example: .2010-01-01,2018-12-31.1960-01-01,1969-12-31

updated	
string
Filter by an update date, for example: .2020-12-01,2020-12-31

platforms_count	
integer
Filter by platforms count, for example: .1

metacritic	
string
Filter by a metacritic rating, for example: .80,100

exclude_collection	
integer
Exclude games from a particular collection, for example: .123

exclude_additions	
boolean
Exclude additions.

exclude_parents	
boolean
Exclude games which have additions.

exclude_game_series	
boolean
Exclude games which included in a game series.

exclude_stores	
string
Exclude stores, for example: .5,6

ordering	
string
Available fields: , , , , , , . You can reverse the sort order adding a hyphen, for example: .namereleasedaddedcreatedupdatedratingmetacritic-released

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Game)
get
/games
https://api.rawg.io/api/games
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get a list of DLC's for the game, GOTY and other editions, companion apps, etc.
path Parameters
game_pk
required
string
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Game)
get
/games/{game_pk}/additions
https://api.rawg.io/api/games/{game_pk}/additions
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get a list of individual creators that were part of the development team.
path Parameters
game_pk
required
string
query Parameters
ordering	
string
Which field to use when ordering the results.

page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (GamePersonList)
get
/games/{game_pk}/development-team
https://api.rawg.io/api/games/{game_pk}/development-team
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get a list of games that are part of the same series.
path Parameters
game_pk
required
string
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Game)
get
/games/{game_pk}/game-series
https://api.rawg.io/api/games/{game_pk}/game-series
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get a list of parent games for DLC's and editions.
path Parameters
game_pk
required
string
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Game)
get
/games/{game_pk}/parent-games
https://api.rawg.io/api/games/{game_pk}/parent-games
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get screenshots for the game.
path Parameters
game_pk
required
string
query Parameters
ordering	
string
Which field to use when ordering the results.

page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (ScreenShot)
get
/games/{game_pk}/screenshots
https://api.rawg.io/api/games/{game_pk}/screenshots
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get links to the stores that sell the game.
path Parameters
game_pk
required
string
query Parameters
ordering	
string
Which field to use when ordering the results.

page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (GameStoreFull)
get
/games/{game_pk}/stores
https://api.rawg.io/api/games/{game_pk}/stores
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the game.
path Parameters
id
required
string
An ID or a slug identifying this Game.

Responses
200
Response Schema: application/json
id	
integer (ID)
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
name	
string (Name) non-empty
name_original	
string (Name original) non-empty
description	
string (Description) non-empty
metacritic	
integer (Metacritic)
metacritic_platforms	
Array of objects (GamePlatformMetacritic)
released	
string <date> (Released)
tba	
boolean (TBA)
updated	
string <date-time> (Updated)
background_image	
string <uri> (Background image)
background_image_additional	
string (Background image additional)
website	
string <uri> (Website) non-empty
rating
required
number (Rating)
rating_top	
integer (Rating top)
ratings	
object (Ratings)
reactions	
object (Reactions)
added	
integer (Added)
added_by_status	
object (Added by status)
playtime	
integer (Playtime)
in hours

screenshots_count	
integer (Screenshots count)
movies_count	
integer (Movies count)
creators_count	
integer (Creators count)
achievements_count	
integer (Achievements count)
parent_achievements_count	
string (Parent achievements count)
reddit_url	
string (Reddit url) non-empty
For example "https://www.reddit.com/r/uncharted/" or "uncharted"

reddit_name	
string (Reddit name) non-empty
reddit_description	
string (Reddit description) non-empty
reddit_logo	
string <uri> (Reddit logo) non-empty
reddit_count	
integer (Reddit count)
twitch_count	
string (Twitch count)
youtube_count	
string (Youtube count)
reviews_text_count	
string (Reviews text count)
ratings_count	
integer (Ratings count)
suggestions_count	
integer (Suggestions count)
alternative_names	
Array of strings (Alternative names)
metacritic_url	
string (Metacritic url) non-empty
For example "http://www.metacritic.com/game/playstation-4/the-witcher-3-wild-hunt"

parents_count	
integer (Parents count)
additions_count	
integer (Additions count)
game_series_count	
integer (Game series count)
esrb_rating	
object Nullable
platforms	
Array of objects
get
/games/{id}
https://api.rawg.io/api/games/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"slug": "string",
"name": "string",
"name_original": "string",
"description": "string",
"metacritic": 0,
"metacritic_platforms": [
{}
],
"released": "2025-04-18",
"tba": true,
"updated": "2025-04-18T09:25:52Z",
"background_image": "http://example.com",
"background_image_additional": "string",
"website": "http://example.com",
"rating": 0,
"rating_top": 0,
"ratings": { },
"reactions": { },
"added": 0,
"added_by_status": { },
"playtime": 0,
"screenshots_count": 0,
"movies_count": 0,
"creators_count": 0,
"achievements_count": 0,
"parent_achievements_count": "string",
"reddit_url": "string",
"reddit_name": "string",
"reddit_description": "string",
"reddit_logo": "http://example.com",
"reddit_count": 0,
"twitch_count": "string",
"youtube_count": "string",
"reviews_text_count": "string",
"ratings_count": 0,
"suggestions_count": 0,
"alternative_names": [
"string"
],
"metacritic_url": "string",
"parents_count": 0,
"additions_count": 0,
"game_series_count": 0,
"esrb_rating": {
"id": 0,
"slug": "everyone",
"name": "Everyone"
},
"platforms": [
{}
]
}
Get a list of game achievements.
path Parameters
id
required
string
An ID or a slug identifying this Game.

Responses
200
Response Schema: application/json
id	
integer (ID)
name	
string (Name) non-empty
description	
string (Description) non-empty
image	
string <uri> (Image)
percent	
string <decimal> (Percent)
get
/games/{id}/achievements
https://api.rawg.io/api/games/{id}/achievements
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"description": "string",
"image": "http://example.com",
"percent": "string"
}
Get a list of game trailers.
path Parameters
id
required
string
An ID or a slug identifying this Game.

Responses
200
Response Schema: application/json
id	
integer (ID)
name	
string (Name) non-empty
preview	
string <uri> (Preview)
data	
object (Data)
get
/games/{id}/movies
https://api.rawg.io/api/games/{id}/movies
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"preview": "http://example.com",
"data": { }
}
Get a list of most recent posts from the game's subreddit.
path Parameters
id
required
string
An ID or a slug identifying this Game.

Responses
200
Response Schema: application/json
id	
integer (ID)
name	
string (Name) non-empty
text	
string (Text) non-empty
image	
string <uri> (Image) non-empty
url	
string <uri> (Url) non-empty
username	
string (Username) non-empty
username_url	
string <uri> (Username url) non-empty
created	
string <date-time> (Created)
get
/games/{id}/reddit
https://api.rawg.io/api/games/{id}/reddit
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"text": "string",
"image": "http://example.com",
"url": "http://example.com",
"username": "string",
"username_url": "http://example.com",
"created": "2025-04-18T09:25:52Z"
}
Get a list of visually similar games, available only for business and enterprise API users.
path Parameters
id
required
string
An ID or a slug identifying this Game.

Responses
200
Response Schema: application/json
id	
integer (ID)
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
name	
string (Name) non-empty
name_original	
string (Name original) non-empty
description	
string (Description) non-empty
metacritic	
integer (Metacritic)
metacritic_platforms	
Array of objects (GamePlatformMetacritic)
released	
string <date> (Released)
tba	
boolean (TBA)
updated	
string <date-time> (Updated)
background_image	
string <uri> (Background image)
background_image_additional	
string (Background image additional)
website	
string <uri> (Website) non-empty
rating
required
number (Rating)
rating_top	
integer (Rating top)
ratings	
object (Ratings)
reactions	
object (Reactions)
added	
integer (Added)
added_by_status	
object (Added by status)
playtime	
integer (Playtime)
in hours

screenshots_count	
integer (Screenshots count)
movies_count	
integer (Movies count)
creators_count	
integer (Creators count)
achievements_count	
integer (Achievements count)
parent_achievements_count	
string (Parent achievements count)
reddit_url	
string (Reddit url) non-empty
For example "https://www.reddit.com/r/uncharted/" or "uncharted"

reddit_name	
string (Reddit name) non-empty
reddit_description	
string (Reddit description) non-empty
reddit_logo	
string <uri> (Reddit logo) non-empty
reddit_count	
integer (Reddit count)
twitch_count	
string (Twitch count)
youtube_count	
string (Youtube count)
reviews_text_count	
string (Reviews text count)
ratings_count	
integer (Ratings count)
suggestions_count	
integer (Suggestions count)
alternative_names	
Array of strings (Alternative names)
metacritic_url	
string (Metacritic url) non-empty
For example "http://www.metacritic.com/game/playstation-4/the-witcher-3-wild-hunt"

parents_count	
integer (Parents count)
additions_count	
integer (Additions count)
game_series_count	
integer (Game series count)
esrb_rating	
object Nullable
platforms	
Array of objects
get
/games/{id}/suggested
https://api.rawg.io/api/games/{id}/suggested
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"slug": "string",
"name": "string",
"name_original": "string",
"description": "string",
"metacritic": 0,
"metacritic_platforms": [
{}
],
"released": "2025-04-18",
"tba": true,
"updated": "2025-04-18T09:25:52Z",
"background_image": "http://example.com",
"background_image_additional": "string",
"website": "http://example.com",
"rating": 0,
"rating_top": 0,
"ratings": { },
"reactions": { },
"added": 0,
"added_by_status": { },
"playtime": 0,
"screenshots_count": 0,
"movies_count": 0,
"creators_count": 0,
"achievements_count": 0,
"parent_achievements_count": "string",
"reddit_url": "string",
"reddit_name": "string",
"reddit_description": "string",
"reddit_logo": "http://example.com",
"reddit_count": 0,
"twitch_count": "string",
"youtube_count": "string",
"reviews_text_count": "string",
"ratings_count": 0,
"suggestions_count": 0,
"alternative_names": [
"string"
],
"metacritic_url": "string",
"parents_count": 0,
"additions_count": 0,
"game_series_count": 0,
"esrb_rating": {
"id": 0,
"slug": "everyone",
"name": "Everyone"
},
"platforms": [
{}
]
}
Get streams on Twitch associated with the game, available only for business and enterprise API users.
path Parameters
id
required
string
An ID or a slug identifying this Game.

Responses
200
Response Schema: application/json
id	
integer (ID)
external_id	
integer (External id)
name	
string (Name) non-empty
description	
string (Description) non-empty
created	
string <date-time> (Created)
published	
string <date-time> (Published)
thumbnail	
string <uri> (Thumbnail) non-empty
view_count	
integer (View count)
language	
string (Language) non-empty
get
/games/{id}/twitch
https://api.rawg.io/api/games/{id}/twitch
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"external_id": 0,
"name": "string",
"description": "string",
"created": "2025-04-18T09:25:52Z",
"published": "2025-04-18T09:25:52Z",
"thumbnail": "http://example.com",
"view_count": 0,
"language": "string"
}
Get videos from YouTube associated with the game, available only for business and enterprise API users.
path Parameters
id
required
string
An ID or a slug identifying this Game.

Responses
200
Response Schema: application/json
id	
integer (ID)
external_id	
string (External id) non-empty
channel_id	
string (Channel id) non-empty
channel_title	
string (Channel title) non-empty
name	
string (Name) non-empty
description	
string (Description) non-empty
created	
string <date-time> (Created)
view_count	
integer (View count)
comments_count	
integer (Comments count)
like_count	
integer (Like count)
dislike_count	
integer (Dislike count)
favorite_count	
integer (Favorite count)
thumbnails	
object (Thumbnails)
get
/games/{id}/youtube
https://api.rawg.io/api/games/{id}/youtube
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"external_id": "string",
"channel_id": "string",
"channel_title": "string",
"name": "string",
"description": "string",
"created": "2025-04-18T09:25:52Z",
"view_count": 0,
"comments_count": 0,
"like_count": 0,
"dislike_count": 0,
"favorite_count": 0,
"thumbnails": { }
}
genres
Get a list of video game genres.
query Parameters
ordering	
string
Which field to use when ordering the results.

page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Genre)
get
/genres
https://api.rawg.io/api/genres
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the genre.
path Parameters
id
required
integer
A unique integer value identifying this Genre.

Responses
200
Response Schema: application/json
id	
integer (ID)
name
required
string (Name) [ 1 .. 100 ] characters
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
games_count	
integer (Games count)
image_background	
string <uri> (Image background) non-empty
description	
string (Description)
get
/genres/{id}
https://api.rawg.io/api/genres/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"slug": "string",
"games_count": 0,
"image_background": "http://example.com",
"description": "string"
}
platforms
Get a list of video game platforms.
query Parameters
ordering	
string
Which field to use when ordering the results.

page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Platform)
get
/platforms
https://api.rawg.io/api/platforms
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get a list of parent platforms.
For instance, for PS2 and PS4 the “parent platform” is PlayStation.

query Parameters
ordering	
string
Which field to use when ordering the results.

page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (PlatformParentSingle)
get
/platforms/lists/parents
https://api.rawg.io/api/platforms/lists/parents
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the platform.
path Parameters
id
required
integer
A unique integer value identifying this Platform.

Responses
200
Response Schema: application/json
id	
integer (ID)
name
required
string (Name) [ 1 .. 100 ] characters
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
games_count	
integer (Games count)
image_background	
string <uri> (Image background)
description	
string (Description)
image	
string <uri> (Image) Nullable
year_start	
integer (Year start) [ 0 .. 32767 ] Nullable
year_end	
integer (Year end) [ 0 .. 32767 ] Nullable
get
/platforms/{id}
https://api.rawg.io/api/platforms/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"slug": "string",
"games_count": 0,
"image_background": "http://example.com",
"description": "string",
"image": "http://example.com",
"year_start": 0,
"year_end": 0
}
publishers
Get a list of video game publishers.
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Publisher)
get
/publishers
https://api.rawg.io/api/publishers
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the publisher.
path Parameters
id
required
integer
A unique integer value identifying this Publisher.

Responses
200
Response Schema: application/json
id	
integer (ID)
name
required
string (Name) [ 1 .. 100 ] characters
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
games_count	
integer (Games count)
image_background	
string <uri> (Image background) non-empty
description	
string (Description)
get
/publishers/{id}
https://api.rawg.io/api/publishers/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"slug": "string",
"games_count": 0,
"image_background": "http://example.com",
"description": "string"
}
stores
Get a list of video game storefronts.
query Parameters
ordering	
string
Which field to use when ordering the results.

page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Store)
get
/stores
https://api.rawg.io/api/stores
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the store.
path Parameters
id
required
integer
A unique integer value identifying this Store.

Responses
200
Response Schema: application/json
id	
integer (ID)
name
required
string (Name) [ 1 .. 100 ] characters
domain	
string (Domain) <= 255 characters Nullable
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
games_count	
integer (Games count)
image_background	
string <uri> (Image background) non-empty
description	
string (Description)
get
/stores/{id}
https://api.rawg.io/api/stores/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"domain": "string",
"slug": "string",
"games_count": 0,
"image_background": "http://example.com",
"description": "string"
}
tags
Get a list of tags.
query Parameters
page	
integer
A page number within the paginated result set.

page_size	
integer
Number of results to return per page.

Responses
200
Response Schema: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Tag)
get
/tags
https://api.rawg.io/api/tags
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Get details of the tag.
path Parameters
id
required
integer
A unique integer value identifying this Tag.

Responses
200
Response Schema: application/json
id	
integer (ID)
name
required
string (Name) [ 1 .. 100 ] characters
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
games_count	
integer (Games count)
image_background	
string <uri> (Image background) non-empty
description	
string (Description)
get
/tags/{id}
https://api.rawg.io/api/tags/{id}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"name": "string",
"slug": "string",
"games_count": 0,
"image_background": "http://example.com",
"description": "string"
}


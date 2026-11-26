---
# Fixes on top of MusicBrainz. The owner edits this file, never src/data/discography.json.
# overrides: by release-group id (the mbid in discography.json). Any of: title, date, type, era, hidden, slug.
#   811ce8bf-30b5-478d-abbc-185acd6d3e0c: { era: halo }
overrides:
  # sora's remix of her own CONSTANTLY: a remix, not a guest feature
  e63c210b-f04b-43cf-b645-1f8006c08b34: { type: remix, slug: constantly-sora-remix }
  # Aura Park (remixes) only repeats the Summer's Gone remix single
  693ff0b1-5fb2-416c-a9c9-6add5bd850b9: { hidden: true }
  # YOG$'s EP only repeats the Someday single (and has no cover)
  7a5af5d0-d3a8-4b11-941c-25a7867e44a4: { hidden: true }
# additions: releases missing on MusicBrainz, e.g. covers.
#   - mbid: cover-example # any unique id
#     slug: cover-example
#     title: "[SONG] (cover)"
#     type: single
#     date: 2017
#     era: covers
additions: []
---

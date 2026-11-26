---
# Shows update by themselves: every build reads the official tour list (tiffdidwhat.com/tour) into src/data/tour.json.
# Use this file only to fix it.
# Add a show the official list doesn't have (timeLocal = start time at the venue, timezone = IANA):
#   shows:
#     - date: 2027-03-04
#       city: "[CITY]"
#       country: US
#       venue: "[VENUE]"
#       timeLocal: "20:00"
#       timezone: America/Chicago
#       source: https://...
# Hide a wrong show: copy its "id" from src/data/tour.json:
#   hide: ["3584498d-2c9a-449f-9ac8-9d52307951e0"]
shows: []
hide: []
---

# Research and prototype notes

Source: the 71-response Google Forms aggregate summary supplied by Group 13 on November 14, 2026. Full question-level counts are encoded in `src/lib/survey.ts` and accessible in the research view.

## Why these interactions

- **Map of reported experiences:** 19/69 Q11 respondents chose information about known Wi-Fi problem areas (27.5%), the largest single category. This is a plurality, not a majority or proof the proposed map works.
- **Visible route to OIT:** 18/69 chose easier access to reporting (26.1%, Q11); 46/69 did not know CometNet issues could be reported (Q7). The demo opens the official CometNet service page rather than pretending to submit a ticket.
- **Immediate feedback:** Q6 describes workarounds (41/55 waited/reconnected; 26/55 used cellular data/hotspots; 16/55 moved) and zero reports to OIT for that incident. The prototype tests whether showing recent community observations at submission is useful. The survey did not directly establish a preference for immediate map feedback.

## Interpretation limits

Question totals differ and multi-select questions do not sum to a single-choice denominator. Enrollment was 70 yes/1 no, but the aggregate data cannot identify and exclude the non-UTD respondent's other answers. Q9 has eight responses despite seven Q8 yes responses; Q10 has 66 despite 62 Q8 no responses. Preserve those counts and flag the skip-logic issue. Q4 includes an unlabeled one-count entry in the pasted summary; it is retained as unresolved.

ECSW is used by 53 of 62 Q1 respondents. Q3 incident counts are not normalized by exposure and cannot establish building failure rates. The aggregate summary provides no timestamps, floors, devices, or symptom-by-building cross-tabs. No sample report text, status, or floor was derived from those missing fields.

## Public references checked November 14, 2026

- [UTD CometNet Wi-Fi service](https://atlas.utdallas.edu/TDClient/30/Portal/Requests/Service/170/CometNet-Wi-Fi) — official reporting/help destination.
- [UTD campus map](https://map.utdallas.edu/) and [published 2024 campus map](https://bpb-us-e2.wpmucdn.com/sites.utdallas.edu/dist/c/1062/files/2024/05/campus-map-2024.pdf) — orientation of ECSW, ECSN, ATC/ATEC, and JSOM. The drawn schematic is approximate, not an official navigation map.

## Proposed short presentation evaluation

Ask a classmate to find ECSW, add an observation, identify the immediate feedback, distinguish a sample report from the survey, and locate official OIT support. Record whether each task succeeds and what confuses them. Do not claim this evaluation has already happened.

import type { SurveyQuestion } from './types';
// Aggregate Google Forms summary supplied by Group 13 on 2026-11-14.
// These are question-level totals, not respondent-level records or current incidents.
export const survey = {
  title: 'Research Survey', responses: 71, suppliedOn: '2026-11-14',
  questions: <SurveyQuestion[]>[
    { id:'eligibility', label:'Enrollment at UT Dallas', n:71, multi:false, options:[['Yes',70],['No',1]] },
    { id:'q1', label:'Buildings regularly used', n:62, multi:true, options:[['JSOM',9],['ECSW',53],['ECSN',27],['ATEC',5]] },
    { id:'q2', label:'Frequency of noticeable CometNet problems', n:67, multi:false, options:[['Never',13],['Less than once a month',16],['A few times a month',26],['A few times a week',10],['Daily or almost daily',2]] },
    { id:'q3', label:'Location of the most recent incident', n:50, multi:false, options:[['JSOM',2],['ECSW',30],['ECSN',15],['ATEC',3]] },
    { id:'q4', label:'What happened during that incident?', n:54, multi:true, options:[['Connection was unusually slow',29],['Connection repeatedly dropped',21],['Connected, but websites/apps would not load',33],['Could not connect at all',6],['More issues in Sciences Building, especially the lobby',1],['Logged out of UTD-email services; correct password did not work',1],['Unlabeled option in supplied summary — needs verification',1]] },
    { id:'q5', label:'Effect on the activity', n:55, multi:true, options:[['Delayed coursework',28],['Prevented completing/submitting coursework',19],['Interrupted a class, meeting, or group activity',29],['No significant effect',13]] },
    { id:'q6', label:'Action taken because of the problem', n:55, multi:true, options:[['Waited or reconnected',41],['Moved to another location',16],['Used cellular data or a hotspot',26],['Stopped the activity',14],['Reported the issue to OIT',0],['Password reset',1]] },
    { id:'q7', label:'Knew CometNet problems could be reported to OIT', n:69, multi:false, options:[['Yes',21],['No',46],['Not sure',2]] },
    { id:'q8', label:'Ever reported a CometNet problem to OIT', n:69, multi:false, options:[['Yes',7],['No',62]] },
    { id:'q9', label:'Experience of the reporting process', n:8, multi:false, options:[['Easy',2],['Neither easy nor difficult',3],['Difficult',2],['Do not remember',1]] },
    { id:'q10', label:'Main reason for not reporting', n:66, multi:false, options:[['Did not know it was possible',25],['Did not know where/how',9],['Too minor or temporary',16],['Moving/reconnecting/mobile data was easier',7],['Did not think reporting would help',1],['Never had a problem worth reporting',8]] },
    { id:'q11', label:'Most useful change', n:69, multi:false, options:[['Easier way to find where to report',18],['Simpler reporting process',7],['Better updates after submitting',8],['Clear troubleshooting guidance',10],['Information about known Wi-Fi problem areas',19],['No change needed',6],['Semester-start campus announcement on reporting',1]] }
  ],
  limitations: [
    'Question totals differ (8–71). Percentages use each question’s own denominator; multi-select totals can exceed 100%.',
    'One of 71 respondents answered “No” to UTD enrollment. Aggregate totals cannot identify or remove that person’s other answers.',
    'Q9 has 8 answers, although Q8 has 7 “Yes” answers. Q10 has 66 answers, although Q8 has 62 “No” answers. Skip-logic inconsistencies need a respondent-level audit.',
    'Q4 contains an unlabeled one-count option in the supplied summary. Preserve it as an unresolved entry; do not infer its meaning.',
    'ECSW is used by 53 of 62 Q1 respondents. The sample favors ECS buildings; incident counts are not normalized failure rates or campus-wide prevalence.',
    'No incident timestamps, floor locations, speed tests, or building-by-symptom cross-tabs are available. This survey cannot establish current outages, causes, or reliable alternative locations.'
  ]
};
export const question = (id: string): SurveyQuestion => survey.questions.find(q => q.id === id)!;
export const percent = (count: number, n: number) => n ? (100 * count / n).toFixed(1) : '0.0';

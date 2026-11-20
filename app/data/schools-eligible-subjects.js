//
// Eligible subjects for each qualification type, used by the autocompletes on
// /schools/data_returned_qualifications_add_eligible. Choosing a type reveals its list.
//
// Keys must match the "What type of qualification is it?" radio values.
//   label    - the radio text
//   slug     - used in field ids
//   field    - where the chosen subject is saved before it's added
//   subjects - the autocomplete options
//
// PROVISIONAL. The official degree list is DfE's spreadsheet of eligible JACS 3.0 and
// HECoS codes (LUP-JACS3_and_HECoS_codes_updated.ods), linked from the GOV.UK guidance
// "Targeted retention incentive payments for school teachers". Replace the higher
// education subjects with that list. A subject can include its code, e.g.
// 'Applied computing (100358)'.
//

module.exports = {
  'Higher Education': {
    label: 'Higher education, for example a degree',
    slug: 'higher-education',
    field: 'newQualificationSubjectHigherEducation',
    subjects: [
      'Chemistry',
      'Analytical chemistry',
      'Inorganic chemistry',
      'Organic chemistry',
      'Physical chemistry',
      'Medicinal chemistry',
      'Computer science',
      'Applied computing',
      'Artificial intelligence',
      'Software engineering',
      'Computer games programming',
      'Cyber security',
      'Mathematics',
      'Pure mathematics',
      'Applied mathematics',
      'Statistics',
      'Operational research',
      'Mathematical modelling',
      'Physics',
      'Theoretical physics',
      'Astrophysics',
      'Nuclear and particle physics',
      'Medical physics',
      'Chemical physics'
    ]
  },
  'Initial teacher training': {
    label: 'Initial teacher training',
    slug: 'initial-teacher-training',
    field: 'newQualificationSubjectInitialTeacherTraining',
    subjects: [
      'Chemistry',
      'Computing',
      'Mathematics',
      'Physics',
      'Physics with mathematics'
    ]
  },
  'A level': {
    label: 'A level',
    slug: 'a-level',
    field: 'newQualificationSubjectALevel',
    subjects: [
      'Chemistry',
      'Computer science',
      'Mathematics',
      'Further mathematics',
      'Physics'
    ]
  }
}

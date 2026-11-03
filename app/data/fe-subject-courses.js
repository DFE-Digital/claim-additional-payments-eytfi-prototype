//
// Courses for each FE subject area.
//
// Each key must match a checkbox value on app/views/fe/contract_subjects.html exactly.
// The courses page (/fe/contract_subjects_courses/<slug>) shows the courses listed here
// for each subject the user picked, in this order.
//
//   slug    - used in the page address, e.g. /fe/contract_subjects_courses/maths
//   name    - optional shorter name for the heading, e.g. 'computing' (defaults to the subject)
//   field   - the name the answers are saved under in session data
//   courses - either a plain string (used as both value and label), or
//             { value: 'short_code', html: 'Label, which can include <a> links' }
//
//

module.exports = {
  'Building and construction': {
    slug: 'building-and-construction',
    field: 'building_construction_courses',
    courses: [
      { value: 'level3_buildingconstruction_approved', html: 'Qualifications approved for funding at level 3 and below in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.qualifications.education.gov.uk/Search?Status=All&amp;Level=0,1,2,3,4&amp;Sub=7">building and construction (opens in new tab)</a> sector subject area' },
      { value: 'tlevel_building', html: 'T Level in building services engineering for construction' },
      { value: 'tlevel_onsiteconstruction', html: 'T Level in onsite construction' },
      { value: 'tlevel_design_surveying', html: 'T Level in design, surveying and planning for construction' },
      { value: 'level2_3_apprenticeship', html: 'Level 2 or level 3 apprenticeships in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://occupational-maps.skillsengland.education.gov.uk/maps/route/construction">construction and the built environment occupational map (opens in new tab)</a>' }
    ]
  },
  'Chemistry': {
    slug: 'chemistry',
    field: 'chemistry_courses',
    courses: [
      'A or AS level chemistry',
      'GCSE chemistry',
      'IBO level 3 SL and HL chemistry, taught as part of a diploma or career related programme or as a standalone certificate',
      'IBO level 1 / level 2 MYP chemistry'
    ]
  },
  'Computing, including digital and ICT': {
    slug: 'computing',
    name: 'computing', // shorter name used in the page heading
    field: 'computing_courses',
    courses: [
      { value: 'level3_and_below_ict_for_practitioners', html: 'Qualifications approved for funding at level 3 and below in the&nbsp;<a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.qualifications.education.gov.uk/Search?Status=All&amp;Level=0,1,2,3,4&amp;Sub=11&amp;PageSize=10&amp;Sort=Status">Digital technology (practitioners) (opens in new tab)</a> sector subject area' },
      { value: 'level3_and_below_ict_for_users', html: 'Qualifications approved for funding at level 3 and below in the&nbsp;<a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.qualifications.education.gov.uk/Search?Status=All&amp;Level=0,1,2,3,4&amp;Sub=12&amp;PageSize=10&amp;Sort=Status">Digital technology for users (opens in new tab)</a> sector subject area' },
      { value: 'digitalskills_quals', html: 'Digital functional skills qualifications and essential digital skills qualifications' },
      { value: 'tlevel_digitalsupport', html: 'T Level in digital support services' },
      { value: 'tlevel_digitalbusiness', html: 'T Level in digital business services' },
      { value: 'tlevel_digitalproduction', html: 'T Level in digital production, design and development' },
      { value: 'ibo_level3_compsci', html: 'IBO level 3 SL and HL computer science, taught as part of a diploma or career related programme or as a standalone certificate' },
      { value: 'level2_3_apprenticeship', html: 'Level 2 or level 3 apprenticeships in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://occupational-maps.skillsengland.education.gov.uk/maps/route/digital">digital occupational map (opens in new tab)</a>' }
    ]
  },
  'Early years': {
    slug: 'early-years',
    field: 'early_years_courses',
    courses: [
      { value: 'eylevel2', html: 'Early years practitioner (level 2) apprenticeship' },
      { value: 'eylevel3', html: 'Early years educator (level 3) apprenticeship' },
      { value: 'eytlevel', html: 'T Level in education and early years (early years educator)' },
      { value: 'coursetoeyq', html: '<a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.gov.uk/guidance/targeted-retention-incentive-payments-for-fe-teachers#early-years">Early years qualifications at Level 3 and below that allow providers to count the recipient in staff‑to‑child ratios and are listed in the eligibility criteria (opens in new tab)</a>' }
    ]
  },
  'Engineering and manufacturing, including transport engineering and electronics': {
    slug: 'engineering',
    name: 'engineering and manufacturing', // shorter name used in the page heading
    field: 'engineering_manufacturing_courses',
    courses: [
      { value: 'approved_level_321_engineering', html: 'Qualifications approved for funding at level 3 and below in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.qualifications.education.gov.uk/Search?Status=All&amp;Level=0,1,2,3,4&amp;Sub=15&amp;PageSize=10&amp;Sort=Status">engineering (opens in new tab)</a> sector subject area' },
      { value: 'approved_level_321_manufacturing', html: 'Qualifications approved for funding at level 3 and below in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.qualifications.education.gov.uk/Search?Status=All&amp;Level=0,1,2,3,4&amp;Sub=26&amp;PageSize=10&amp;Sort=Status">manufacturing technologies (opens in new tab)</a> sector subject area' },
      { value: 'approved_level_321_transportation', html: 'Qualifications approved for funding at level 3 and below in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.qualifications.education.gov.uk/Search?Status=All&amp;Level=0,1,2,3,4&amp;Sub=47&amp;PageSize=10&amp;Sort=Status">transportation operations and maintenance (opens in new tab)</a> sector subject area' },
      { value: 'tlevel_design', html: 'T Level in design and development for engineering and manufacturing' },
      { value: 'tlevel_maintenance', html: 'T Level in maintenance, installation and repair for engineering and manufacturing' },
      { value: 'tlevel_engineering', html: 'T Level in engineering, manufacturing, processing and control' },
      { value: 'level2_3_apprenticeship', html: 'Level 2 or level 3 apprenticeships in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://occupational-maps.skillsengland.education.gov.uk/maps/route/engineering-manufacturing">engineering and manufacturing occupational map (opens in new tab)</a>' }
    ]
  },
  'Maths': {
    slug: 'maths',
    field: 'maths_courses',
    courses: [
      { value: 'approved_level_321_maths', html: 'Qualifications approved for funding at level 3 and below in the <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://www.qualifications.education.gov.uk/Search?Status=All&amp;Level=0,1,2,3,4&amp;Sub=28&amp;PageSize=10&amp;Sort=Status">mathematics and statistics (opens in new tab)</a> sector subject area' },
      { value: 'gcse_maths', html: 'GCSE in maths, functional skills qualifications and <a class="govuk-link" target="_blank" rel="noreferrer noopener" href="https://submit-learner-data.service.gov.uk/find-a-learning-aim/">other maths qualifications (opens in new tab)</a> approved for teaching to 16 to 19-year-olds who meet the condition of funding' }
    ]
  },
  'Physics': {
    slug: 'physics',
    field: 'physics_courses',
    courses: [
      'A or AS level physics',
      'GCSE physics',
      'IBO level 1 / level 2 MYP physics',
      'IBO level 3 in SL and HL physics, taught as part of a diploma or career related programme or as a standalone certificate'
    ]
  }
}

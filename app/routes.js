//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

const uploadedDocumentPreview = {
  fileName: 'document.jpg',
  fileSize: '2MB',
  imagePath: '/public/images/example-payslip.png'
}

function buildUploadedDocumentRows(uploadedDocuments) {
  return uploadedDocuments.map((document, index) => ([
    {
      text: `File ${index + 1}`
    },
    {
      html: `<a class="govuk-link" href="${document.imagePath}" target="_blank" rel="noreferrer noopener">${document.fileName}</a>, ${document.fileSize}`
    },
    {
      html: '<a class="govuk-link" href="#">Delete</a>'
    }
  ]))
}

function buildUploadedDocumentSummary(uploadedDocuments) {
  if (!uploadedDocuments || uploadedDocuments.length === 0) {
    return '<a class="govuk-link" href="/public/images/example-payslip.png" target="_blank" rel="noreferrer noopener">document.jpg</a>, 2MB'
  }

  return uploadedDocuments
    .map((document) => `<a class="govuk-link" href="${document.imagePath}" target="_blank" rel="noreferrer noopener">${document.fileName}</a>, ${document.fileSize}`)
    .join('<br>')
}

router.use(function (req, res, next) {
  if (req.method === 'GET' && !req.path.includes('.')) {
    if (req.query.returnUrl && req.query.returnUrl.startsWith('/')) {
      // Arrived from a Change link, so remember where to go back to
      req.session.returnUrl = req.query.returnUrl
    } else {
      // Any other page visit cancels it (e.g. they clicked Back instead)
      delete req.session.returnUrl
    }
    delete req.session.data.returnUrl   // keep it out of your form data
  }
  next()
})

router.post('*', function (req, res, next) {
  const returnUrl = req.session.returnUrl
  if (returnUrl) {
    delete req.session.returnUrl
    return res.redirect(returnUrl)
  }
  next()
})

router.get('/check-nursery', (req, res) => {
  const { nursery } = req.query

  if (nursery === 'little-stars-nursery') {
    return res.redirect('/ineligible-nursery')
  }

  return res.redirect('/teaching-qualification-confirmation')
})

router.get('/check-teaching-qualification', (req, res) => {
  const { hasEligibleTeachingQualification } = req.query

  if (hasEligibleTeachingQualification === 'no') {
    return res.redirect('/ineligible-teaching-qualification-held')
  }

  return res.redirect('/eligible-teaching-qualification-held')
})

router.get('/check-one-login-journey', (req, res) => {
  const { oneLoginJourney } = req.query

  if (oneLoginJourney === 'signed-out') {
    return res.redirect('/one-login-sign-in-email')
  }

  if (oneLoginJourney === 'sign-up') {
    return res.redirect('/one-login-sign-up-start')
  }

  return res.redirect('/one-login-continue-to-service')
})

router.get('/check-teacher-reference-number', (req, res) => {
  const { hasTeacherReferenceNumber } = req.query

  if (hasTeacherReferenceNumber === 'no') {
    return res.redirect('/teacher-auth-no-teacher-reference-number.html')
  }

  return res.redirect('/teacher-auth-record-match')
})

router.get('/check-teacher-auth-record-match', (req, res) => {
  const { teacherAuthRecordMatch } = req.query

  if (teacherAuthRecordMatch === 'not-matched') {
    return res.redirect('/teacher-auth-record-not-matched')
  }

  if (teacherAuthRecordMatch === 'matched-qualification-ineligible') {
    return res.redirect('/ineligible-qualification-confirmed')
  }

  return res.redirect('/eligibile-qualification-confirmed')
})

router.post('/confirm-where-you-work-uploaded', (req, res) => {
  


  return res.redirect('/accept-payment')
})

router.get('/check-uploaded-file', (req, res) => {
  const { isFileCorrect } = req.query

  if (isFileCorrect === 'no') {
    req.session.data.pendingUploadedDocument = null
    return res.redirect('/confirm-where-you-work')
  }

  const uploadedDocuments = req.session.data.uploadedDocuments || []
  const pendingUploadedDocument = req.session.data.pendingUploadedDocument || uploadedDocumentPreview

  req.session.data.uploadedDocuments = [...uploadedDocuments, pendingUploadedDocument]
  req.session.data.pendingUploadedDocument = null

  return res.redirect('/confirm-where-you-work-uploaded-documents')
})

router.get('/confirm-where-you-work-uploaded-documents', (req, res) => {
  const uploadedDocuments = req.session.data.uploadedDocuments || [uploadedDocumentPreview]

  return res.render('confirm-where-you-work-uploaded-documents', {
    uploadedDocumentRows: buildUploadedDocumentRows(uploadedDocuments)
  })
})

router.get('/check-another-document', (req, res) => {
  const { uploadAnotherDocument } = req.query

  if (uploadAnotherDocument === 'yes') {
    return res.redirect('/confirm-where-you-work')
  }

  return res.redirect('/confirm-where-you-work-uploaded-documents-confirmation')
})

router.get('/check-answers', (req, res) => {
  const uploadedDocuments = req.session.data.uploadedDocuments || [uploadedDocumentPreview]

  return res.render('check-answers', {
    uploadedDocumentsSummary: buildUploadedDocumentSummary(uploadedDocuments)
  })
})

router.get('/check-payment-acceptance', (req, res) => {
  const { acceptPayment } = req.query

  if (acceptPayment === 'no') {
    return res.redirect('/payment-rejected')
  }

  return res.redirect('/how-we-will-use-your-information')
})

router.get('/start-new-claim', (req, res) => {
  req.session.data = {}

  return res.redirect('/')
})

router.post('/feedback', (req, res) => {

  req.session.data.success = 'Your feedback has been submitted'

  res.redirect('/feedback')
})


router.post('/teaching-qualification-confirmation', (req, res) => {

  var hasEligibleTeachingQualification = req.session.data.hasEligibleTeachingQualification

  if (hasEligibleTeachingQualification == 'yes') {
    res.redirect('/eligibility-criteria')
  }else{
    res.redirect('/ineligible-teaching-qualification-held')
  }

})


router.post('/eligibility-criteria', (req, res) => {

  var hasEligibleWorking = req.session.data.hasEligibleWorking

  if (hasEligibleWorking == 'yes') {
    res.redirect('/check-teaching-qualification')
  }else{
    res.redirect('/ineligible-teaching-qualification-held')
  }

})


router.post('/hmrc', (req, res) => {

  var hmrcJourney = req.session.data.hmrcJourney

  if (hmrcJourney == 'error') {
    return res.redirect('/hmrc_error')
  }

  else if (hmrcJourney == 'good') {
    return res.redirect('/accept-payment')
  }

  else{
    return res.redirect('/hmrc_bad')
  }


})

router.get('/confirm-where-you-work-no-success', (req, res) => {
  res.render('confirm-where-you-work-no-success');
}) 


///////
// nursery search
///////

router.post('/nursery-search', (req, res) => {

  const nurserySearch = req.session.data.nurserySearch;

  if (nurserySearch === 'true') {
    res.redirect('/teaching-qualification-confirmation');
  } else if (nurserySearch === 'false') {
    res.redirect('/ineligible-nursery');
  } else {
    res.redirect('/nursery-results');
  }

});


router.post('/one-login-continue-to-service', (req, res) => {

  const oneLoginJourney = req.session.data.oneLoginJourney;

  if (oneLoginJourney == 'yes, ok qualification') {
    res.redirect('/eligibile-qualification-confirmed');
  } else if (oneLoginJourney == 'yes, bad qualification') {
    res.redirect('/ineligible-qualification-confirmed');
  }else {
    res.redirect('/teacher-auth-find-your-teaching-record');
  }

});

router.post('/eligibile-qualification-confirmed', (req, res) => {

  const oneLoginJourney = req.session.data.oneLoginJourney;

  if (oneLoginJourney == 'yes') {
    res.redirect('/hmrc_ni_returned');
  } else {
    res.redirect('/hmrc_ni');
  }

});


///////
// ops
///////


router.post('/ops/claims/payroll', (req, res) => {

  req.session.data.success = 'HMRC bank validation has been retried'

  res.redirect('/ops/claims/payroll')
})

router.post('/ops/services_ey', (req, res) => {

  var autoApproval = req.session.data.automatic_approvals

  if (autoApproval == 'true') {
    req.session.data.success = 'on'
  }else{
    req.session.data.success = 'off'
  }

  res.redirect('/ops/services_ey')

})



router.post('/teacher-auth-national-insurance-number', (req, res) => {

  var national = req.session.data.hasNationalInsuranceNumber

  if (national == 'yes') {

    res.redirect('teacher-auth-record-match')

  }else{
    res.redirect('teacher-auth-teacher-reference-number')
  }
  
})



///////////////////

///// claimant model

///////////////////


router.post('/claimantmodel/start', (req, res) => {

  var type = req.session.data.logintype
  var claimNumber = req.session.data.claimNumber

  if (type == 'ref') {

    if (claimNumber == 'rejected') {
      res.redirect('claim-rejected')
    }
    else if (claimNumber == 'not found') {
      res.redirect('claim-not-found')
    }
    else{
      res.redirect('sent_you_an_email')
    }

  }else{
    res.redirect('one-login-start')
  }
  
})


router.post('/claimantmodel/bank-details', (req, res) => {

  req.session.data.success = 'Bank details have been updated'

  res.redirect('/claimantmodel/check_progress_result')
})






///////////////////

///// STRI SCHOOL PAYMENTS

///////////////////



router.get('/schools/start', function (req, res) {

  if (req.query.oneLoginReturnJourney) {
    req.session.oneLoginReturnJourney = req.query.oneLoginReturnJourney
  }

  if (req.query.dataType) {
    req.session.dataType = req.query.dataType
  }

  res.render('schools/start')
})



///////
// school search
///////

router.post('/schools/school_search', (req, res) => {

  const schoolSearch = req.session.data.schoolSearch;

  if (schoolSearch == 'true') {
    res.redirect('school_search_result');
  } else if (schoolSearch == 'false') {
    res.redirect('school_ineligible');
  } 

});

router.post('/schools/one-login-continue-to-service', (req, res) => {

  const schoolSearch = req.session.data.oneLoginReturnJourney;

  if (schoolSearch == 'scenario_one') {
    req.session.data.success = 'Your teaching details have been found'
    res.redirect('hmrc_ni_returned');
  } else if (schoolSearch == 'scenario_two') {
    res.redirect('hmrc_ni');
  }else if (schoolSearch == 'no previous claims, teacher auth not attached') {
    res.redirect('teacher-auth-find-your-teaching-record');
  } else{
    res.redirect('previous_claims');
  }

});


router.post('/schools/teacher-auth-national-insurance-number', (req, res) => {

  var national = req.session.data.hasNationalInsuranceNumber

  if (national == 'yes') {

    res.redirect('/schools/teacher-auth-record-match')

  }else{
    res.redirect('/schools/teacher-auth-teacher-reference-number')
  }
  
})

router.post('/schools/teacher-auth-teacher-reference-number', (req, res) => {

  var national = req.session.data.hasTeacherReferenceNumber

  if (national == 'yes') {

    res.redirect('/schools/teacher-auth-record-match')

  }else{
    res.redirect('/schools/teacher-auth-no-teacher-reference-number')
  }
  
})


router.post('/schools/school_hours', (req, res) => {

  const theHours = req.session.data.hours;

  if (theHours == 'Yes') {
    res.redirect('one-login-start');
  } else {
    res.redirect('school_ineligible_hours');
  } 

});

router.post('/schools/school_search_result', (req, res) => {

  const schoolValid = req.session.data.schoolValid;

  if (schoolValid == 'school valid') {
    res.redirect('/schools/school_hours');
  } else {
    res.redirect('/schools/school_ineligible');
  } 

});

router.post('/schools/teacher-auth-record-match', (req, res) => {
  
  const teacherAuthRecordMatch = req.session.data.teacherAuthRecordMatch;

  if (teacherAuthRecordMatch === 'matched') {

    req.session.data.success = 'Your details have been found'

    return res.redirect('data_returned')
  }

  else if (teacherAuthRecordMatch === 'matched-qualification-ineligible') {
    return res.redirect('ineligible-qualification-confirmed')
  }

  else{
    return res.redirect('teacher-auth-record-not-matched')
  }

})

router.post('/schools/data_returned', (req, res) => {
  
  const isCorrect = req.session.data.correct;
  const dataType = req.session.data.dataType;

  if (dataType === 'Yes, details eligible') {

    return res.redirect('hmrc')

  } else if (dataType === 'Yes, but not eligible') {

    return res.redirect('data_returned_ineligible')

  }else{
    return res.redirect('data_returned_incorrect')
  }

})

router.post('/schools/hmrc', (req, res) => {

  var hmrcJourney = req.session.data.hmrcJourney

  if (hmrcJourney == 'error') {
    return res.redirect('hmrc_error')
  }

  else if (hmrcJourney == 'good') {
    req.session.data.success = ""
    req.session.data.successText = ''
    return res.redirect('accept-payment')
  }

  else{
    return res.redirect('hmrc_bad')
  }


})


router.post('/schools/data_returned_teacher', (req, res) => {

  var contact = req.session.data.contact

  if (contact == 'yes') {
    req.session.data.success = ""
    req.session.data.successText = ''
  }else{
    req.session.data.success = "We've received the details you provided."
    req.session.data.successText = "We'll review them and contact you if we need more information."
  }
 
  return res.redirect('data_returned_qualifications')
  
})

router.post('/schools/data_returned_qualifications', (req, res) => {
  
  var contact = req.session.data.contact

  if (contact == 'yes') {
    req.session.data.success = ""
    req.session.data.successText = ''
  
  }else{
    req.session.data.success = "We've received the details you provided."
    req.session.data.successText = "We'll review them and contact you if we need more information."
  }
  
  return res.redirect('hmrc')
  
})

router.post('/schools/confirm-where-you-work-uploaded', (req, res) => {
  
  
    req.session.data.success = "Document uploaded successfully"
    req.session.data.successText = "We'll review your document to confirm where you work."
 
  return res.redirect('accept-payment')
  
})









///////
// FE ROUTES
///////


//prototype magic

router.get('/fe/start', function (req, res) {
  if (req.query.oneLoginJourney) {
    req.session.data.oneLoginJourney = req.query.oneLoginJourney
  }
  return res.render('fe/start')
})

///////
// FE PERSONAS
// Add or edit personas here. Answer values must match the radio/checkbox
// values on the question pages in app/views/fe exactly.
///////

const fePersonas = {
  'persona-1': {
    name: 'Persona 1',
    description: 'Returning claimant on a fixed-term contract, teaches computing and GCSE physics',
    answers: {
      oneLoginJourney: 'previous',
      staff: 'yes',
      feSearch: 'Nottingham College',
      startyear: 'September 2023 to August 2024',
      teaching_qualification: 'No, but I plan to enrol on one in the next 12 months',
      contract: 'Fixed term',
      hours: '12 or more hours per week, but fewer than 20',
      tlevel: 'No',
      subjects: ['Computing, including digital and ICT'],
      physics_courses: ['GCSE physics'],
      hours_teaching_eligible_subjects: 'Yes',
      hasPerformance: 'yes'
    }
  },
  'persona-2': {
    name: 'Persona 2 (example - edit me)',
    description: 'New claimant, permanent full-time maths and physics teacher with a qualification',
    answers: {
      oneLoginJourney: 'new',
      staff: 'yes',
      feSearch: 'Bilborough College',
      teaching_qualification: 'yes',
      contract: 'permanent',
      hours: '20 hours or more per week',
      tlevel: 'Yes',
      subjects: ['Maths', 'Physics'],
      physics_courses: ['A or AS level physics', 'GCSE physics'],
      hours_teaching_eligible_subjects: 'Yes',
      hasPerformance: 'yes',
      hasEligibleWorking: 'yes',
      hmrcJourney: 'good'
    }
  },
  'persona-3': {
    name: 'Persona 3 (example - edit me)',
    description: 'Variable hours teacher with fewer than 2.5 hours a week, no teaching qualification',
    answers: {
      oneLoginJourney: 'new',
      staff: 'yes',
      feSearch: 'Leicester College',
      teaching_qualification: 'No, and I do not plan to enrol on one in the next 12 months',
      contract: 'Variable hours',
      hours: 'Fewer than 2.5 hours each week',
      tlevel: 'No',
      subjects: ['Early years'],
      hmrcJourney: 'bad'
    }
  }
}

// Friendly labels for the personas page
const fePersonaLabels = {
  oneLogin: 'Has a One Login account',
  oneLoginJourney: 'One Login scenario',
  previous: 'Applied between September 2025 and May 2026',
  staff: 'Teaching responsibilities',
  feSearch: 'Employer',
  schoolValid: 'Employer result',
  academic: 'Started teaching FE after September 2022',
  startyear: 'Start year',
  teaching_qualification: 'Teaching qualification',
  contract: 'Contract type',
  hours: 'Hours per week',
  spring: 'Taught the full spring term',
  tlevel: '16 to 19 / T Levels',
  subjects: 'Subjects',
  building_construction_courses: 'Building and construction courses',
  chemistry_courses: 'Chemistry courses',
  computing_courses: 'Computing courses',
  early_years_courses: 'Early years courses',
  engineering_manufacturing_courses: 'Engineering and manufacturing courses',
  maths_courses: 'Maths courses',
  physics_courses: 'Physics courses',
  hours_teaching_eligible_subjects: 'Half of hours on eligible courses',
  hasPerformance: 'Performance criteria met',
  hasEligibleWorking: 'Disciplinary criteria met',
  hmrcJourney: 'HMRC check'
}

// Page listing all personas
router.get('/fe/personas', function (req, res) {
  res.render('fe/personas', {
    personas: fePersonas,
    labels: fePersonaLabels,
    activePersona: req.session.data.activePersona
  })
})

// Load a persona: clears the session, sets its answers, goes to start
router.get('/fe/personas/:id', function (req, res) {
  const persona = fePersonas[req.params.id]
  if (!persona) return res.redirect('/fe/personas')

  req.session.data = JSON.parse(JSON.stringify(persona.answers))
  req.session.data.activePersona = req.params.id
  res.redirect('/fe/start')
})

// Old link still works
router.get('/fe/persona1', function (req, res) {
  res.redirect('/fe/personas/persona-1')
})

router.post('/fe/one-login', (req, res) => {

  var oneLogin = req.session.data.oneLogin

  if (oneLogin == 'yes') {
    return res.redirect('one-login-start')
  }

  else if (oneLogin == 'no') {
    return res.redirect('staff')
  }

  else{
    return res.redirect('staff')
  }

})


router.post('/fe/previously_claimed', (req, res) => {

  var previous = req.session.data.previous

  if (previous == 'yes') {
    return res.redirect('one-login-start')
  }

  else{
    return res.redirect('check-eligibility-intro')
  }


})


router.post('/fe/one-login-continue-to-service', (req, res) => {

  var oneLoginJourney = req.session.data.oneLoginJourney

  if (oneLoginJourney == 'already') {
    return res.redirect('check_progress_result')
  } else if (oneLoginJourney == 'previous_error') {
    return res.redirect('previous_error')
  } else if (oneLoginJourney == 'previous') {
    return res.redirect('check_previous_application')
  } else{
    return res.redirect('staff')
  }

})


router.post('/fe/fe_search_result', (req, res) => {

  var schoolValid = req.session.data.schoolValid

  if (schoolValid == 'employer valid') {
    return res.redirect('academic_year')
  }

  else{
    return res.redirect('fe_ineligible')
  }


})


router.post('/fe/hmrc', (req, res) => {

  var hmrcJourney = req.session.data.hmrcJourney

  if (hmrcJourney == 'good') {
    return res.redirect('accept-payment')
  }

  else{
    return res.redirect('hmrc_bad')
  }


})


router.post('/fe/confirm-where-you-work-uploaded', (req, res) => {
  
  
    req.session.data.success = "Document uploaded successfully"
    req.session.data.successText = "We'll review your document to confirm where you work."
 
  return res.redirect('accept-payment')
  
})


router.post('/fe/spring-term', (req, res) => {

  var spring = req.session.data.spring

  if (spring == 'yes') {
    return res.redirect('eligibility-criteria')
  }

  else{
    return res.redirect('spring-term-ineligible')
  }


})

router.post('/fe/eligibility-criteria', (req, res) => {

  var hasEligibleWorking = req.session.data.hasEligibleWorking

  if (hasEligibleWorking == 'yes') {
    res.redirect('check-teaching-qualification')
  }else{
    res.redirect('ineligible-teaching-qualification-held')
  }

})

router.post('/fe/staff', (req, res) => {

  var staff = req.session.data.staff

  if (staff == 'yes') {
    return res.redirect('fe_search')
  }

  else{
    return res.redirect('ineligible')
  }


})


router.post('/fe/academic_year', (req, res) => {

  var startyear = req.session.data.startyear
  var academic = req.session.data.academic

  if (academic == 'no') {
    return res.redirect('ineligible_years')
  }

  else{
    return res.redirect('teaching_qualification')
  }


})

router.post('/fe/teaching_qualification', (req, res) => {

  var teaching_qualification = req.session.data.teaching_qualification

  if (teaching_qualification == 'no') {
    return res.redirect('ineligible_qualification')
  }

  else{
    return res.redirect('contract')
  }


})

router.post('/fe/contract', (req, res) => {

  var contract = req.session.data.contract

  if (contract == 'fixed_term') {
    return res.redirect('contract_fixedterm')
  } else if (contract == 'variable_hours') {
    return res.redirect('contract_variable')
  } else if (contract == 'permanent') {
    return res.redirect('contract_permanent')
  }
  else{
    return res.redirect('ineligible_contract')
  }


})

router.post('/fe/contract_fixedterm', (req, res) => {

  var contract = req.session.data.contract

  if (contract == 'yes') {
    return res.redirect('contract_permanent')
  } 
  else{
    return res.redirect('contract_variable')
  }


})

router.post('/fe/contract_variable', (req, res) => {

  var contract = req.session.data.contract

  if (contract == 'Yes') {
    return res.redirect('contract_permanent')
  } 
  else{
    return res.redirect('ineligible_yet')
  }


})

router.post('/fe/contract_permanent', (req, res) => {

  var permanent = req.session.data.permanent

  if (permanent == 'less_than_2_5') {
    return res.redirect('ineligible_25')
  } 
  else{
    return res.redirect('contract_tlevel')
  }

})

router.post('/fe/contract_tlevel', (req, res) => {

  var tlevel = req.session.data.tlevel

  if (tlevel == 'Yes') {
    return res.redirect('contract_subjects')
  } 
  else{
    return res.redirect('ineligible_tlevel')
  }

})

///////
// FE SUBJECT COURSES (dynamic)
// The courses for each subject are kept in app/data/fe-subject-courses.js
///////

const feSubjectCourses = require('./data/fe-subject-courses')

// The subjects the user ticked, in the order they appear on the page
function feSelectedSubjects (data) {
  const chosen = [].concat(data.subjects || [])
  return Object.keys(feSubjectCourses)
    .filter(label => chosen.includes(label))
    .map(label => {
      const config = feSubjectCourses[label]
      const courses = config.courses.map(c => typeof c === 'string' ? { value: c, html: c } : c)
      const answers = [].concat(data[config.field] || [])
      // Plain-text labels of the chosen courses, for check answers
      const answerText = answers.map(a => {
        if (a === 'none') return 'I do not teach any of these courses'
        const course = courses.find(c => c.value === a)
        return course ? course.html.replace(/<[^>]+>/g, '').replace(' (opens in new tab)', '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&') : a
      })
      return Object.assign({ label: label, name: label }, config, { courses, answers, answerText })
    })
}

// Make the selected subjects available to every FE page (used on check answers)
router.use('/fe', function (req, res, next) {
  res.locals.feSelectedSubjects = feSelectedSubjects(req.session.data)
  next()
})

router.post('/fe/contract_subjects', (req, res) => {
  const selected = feSelectedSubjects(req.session.data)

  if (selected.length === 0) {
    return res.redirect('/fe/ineligible_subjects')
  }
  res.redirect('/fe/contract_subjects_courses')
})

// One page showing the courses for every subject the user picked
router.get('/fe/contract_subjects_courses', (req, res) => {
  const selected = feSelectedSubjects(req.session.data)
  if (selected.length === 0) return res.redirect('/fe/contract_subjects')

  res.render('fe/contract_subjects_courses', { subjects: selected })
})

router.post('/fe/contract_subjects_courses', (req, res) => {
  const selected = feSelectedSubjects(req.session.data)

  // Ineligible if they teach none of the courses in every subject they picked
  const teachesNone = selected.every(s => s.answers.length && s.answers.every(a => a === 'none'))
  if (teachesNone) {
    return res.redirect('/fe/ineligible_subjects')
  }

  res.redirect('/fe/contract_subjects_time')
})

// Older one-subject-per-page addresses, kept so saved links still work
router.get('/fe/contract_subjects_courses/:slug', (req, res) => {
  res.redirect('/fe/contract_subjects_courses' + (req.query.returnUrl ? '?returnUrl=' + encodeURIComponent(req.query.returnUrl) : '') + '#' + req.params.slug)
})

// Old physics-only addresses, kept so any saved links still work
router.get('/fe/contract_subjects_physics', (req, res) => res.redirect('/fe/contract_subjects_courses#physics'))
router.get('/fe/contract_subjects_physics_time', (req, res) => res.redirect('/fe/contract_subjects_time'))

///////
// FE PERSONA LINK GENERATOR
// /fe/research-setup  - team member picks answers
// /fe/research-link   - shows the link to send to a participant
// /fe/load            - participant opens the link; answers are loaded and they land on the chosen page
// Setup fields are prefixed with p_ so they don't overwrite the team member's own session answers.
///////

const feResearchStartPages = {
  'start': { href: '/fe/start', text: 'Start page' },
  'check_previous_application': { href: '/fe/check_previous_application', text: 'Check your previous application' },
  'check_previous_answers': { href: '/fe/check_previous_answers', text: 'Check your previous answers' },
  'check_answers': { href: '/fe/check_answers', text: 'Check your answers' }
}

// Turn query values into { key: [values] }, dropping blanks
function feResearchValues (query, prefix) {
  const values = {}
  for (const [key, value] of Object.entries(query || {})) {
    if (prefix && !key.startsWith(prefix)) continue
    const name = prefix ? key.slice(prefix.length) : key
    const list = [].concat(value).filter(v => v !== '' && v !== '_unchecked')
    if (list.length) values[name] = list
  }
  return values
}

router.get('/fe/research-setup', (req, res) => {
  // Prefill from a persona (?from=persona-1) or from a previous link (Edit these answers)
  let values = feResearchValues(req.query, 'p_')
  const persona = fePersonas[req.query.from]
  if (persona) values = feResearchValues(persona.answers)

  res.render('fe/research-setup', {
    values,
    personas: fePersonas,
    subjectCourses: Object.entries(feSubjectCourses).map(([label, config]) => Object.assign({ label, name: label }, config, {
      courses: config.courses.map(c => typeof c === 'string' ? { value: c, html: c } : c)
    }))
  })
})

router.get('/fe/research-link', (req, res) => {
  const values = feResearchValues(req.query, 'p_')
  delete values.goto // links always open the start page

  // Remove the setup answers the kit auto-stored in the team member's own session
  for (const key of Object.keys(req.session.data)) {
    if (key.startsWith('p_')) delete req.session.data[key]
  }

  // Only keep course answers for subjects that were ticked
  const subjects = values.subjects || []
  for (const [label, config] of Object.entries(feSubjectCourses)) {
    if (!subjects.includes(label)) delete values[config.field]
  }

  const params = new URLSearchParams()
  const editParams = new URLSearchParams()
  for (const [key, list] of Object.entries(values)) {
    list.forEach(v => { params.append(key, v); editParams.append('p_' + key, v) })
  }

  const protocol = req.get('x-forwarded-proto') || req.protocol
  const link = `${protocol}://${req.get('host')}/fe/load?${params}`

  const summary = Object.entries(values)
    .filter(([key]) => key !== 'goto')
    .map(([key, list]) => {
      const subject = Object.values(feSubjectCourses).find(c => c.field === key)
      const text = list.map(v => {
        if (v === 'none') return 'Does not teach any of these courses'
        const course = subject && subject.courses.find(c => (c.value || c) === v)
        return course ? String(course.html || course).replace(/<[^>]+>/g, '').replace(' (opens in new tab)', '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&') : v
      })
      return { key: fePersonaLabels[key] || key, values: text }
    })

  res.render('fe/research-link', {
    link,
    summary,
    startPage: (feResearchStartPages[(values.goto || [])[0]] || feResearchStartPages.start).text,
    editHref: '/fe/research-setup?' + editParams
  })
})

router.get('/fe/load', (req, res) => {
  const values = feResearchValues(req.query)
  const goto = (feResearchStartPages[(values.goto || [])[0]] || feResearchStartPages.start).href
  delete values.goto

  // Fresh session for the participant: single answers as text, checkbox answers as lists
  const data = {}
  const listFields = ['subjects'].concat(Object.values(feSubjectCourses).map(c => c.field))
  for (const [key, list] of Object.entries(values)) {
    data[key] = listFields.includes(key) ? list : list[0]
  }
  req.session.data = data
  res.redirect(goto)
})

router.post('/fe/contract_subjects_time', (req, res) => {

  var hours_teaching_eligible_subjects = req.session.data.hours_teaching_eligible_subjects

  if (hours_teaching_eligible_subjects == 'No') {
    return res.redirect('ineligible_subjects_time')
  } 
  else{
    return res.redirect('performance')
  }

})

router.post('/fe/performance', (req, res) => {

  var hasEligibleWorking = req.session.data.hasEligibleWorking

  if (hasEligibleWorking == 'no') {
    return res.redirect('ineligible_performance')
  } 
  else{
    return res.redirect('check_answers')
  }

})


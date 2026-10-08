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

router.post('/fe/one-login', (req, res) => {

  var oneLogin = req.session.data.oneLogin

  if (oneLogin == 'yes') {
    return res.redirect('one-login-start')
  }

  else if (oneLogin == 'no') {
    return res.redirect('previously_claimed')
  }

  else{
    return res.redirect('previously_claimed')
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
    return res.redirect('check-eligibility-intro')
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
    return res.redirect('spring-term')
  }

  else{
    return res.redirect('hmrc_bad')
  }


})


router.post('/fe/confirm-where-you-work-uploaded', (req, res) => {
  
  
    req.session.data.success = "Document uploaded successfully"
    req.session.data.successText = "We'll review your document to confirm where you work."
 
  return res.redirect('spring-term')
  
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

  if (startyear == 'pre-2022') {
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

router.post('/fe/contract_subjects', (req, res) => {

  var subjects = req.session.data.subjects

  if (subjects == 'none') {
    return res.redirect('ineligible_subjects')
  } 
  else{
    return res.redirect('contract_subjects_physics')
  }

})

router.post('/fe/contract_subjects_physics', (req, res) => {

  var claim_physics = req.session.data.claim_physics

  if (claim_physics == 'none') {
    return res.redirect('ineligible_subjects')
  } 
  else{
    return res.redirect('contract_subjects_physics_time')
  }

})

router.post('/fe/contract_subjects_physics_time', (req, res) => {

  var hours_teaching_eligible_subjects = req.session.data.hours_teaching_eligible_subjects

  if (hours_teaching_eligible_subjects == 'No') {
    return res.redirect('ineligible_subjects_time')
  } 
  else{
    return res.redirect('performance')
  }

})

router.post('/fe/performance', (req, res) => {

  var subject_to_formal_performance_action = req.session.data.subject_to_formal_performance_action
  var subject_to_disciplinary_action = req.session.data.subject_to_disciplinary_action

  if (subject_to_formal_performance_action == 'Yes') {
    return res.redirect('ineligible_performance')
  } 
  else if (subject_to_disciplinary_action == 'Yes') {
    return res.redirect('ineligible_performance')
  }else{
    return res.redirect('check_answers')
  }

})
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
  req.session.data.pendingUploadedDocument = uploadedDocumentPreview

  return res.redirect('/confirm-where-you-work-uploaded')
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


///////
// nursery search
///////

router.post('/nursery-search', (req, res) => {

  const nurserySearch = req.session.data.nurserySearch;

  if (nurserySearch === 'true') {
    res.redirect('/eligibility-criteria');
  } else if (nurserySearch === 'false') {
    res.redirect('/ineligible-teaching-qualification-held');
  } else {
    res.redirect('/nursery-results');
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



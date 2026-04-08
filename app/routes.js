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

  if (nursery === 'ineligible-nursery') {
    return res.redirect('/ineligible-nursery')
  }

  return res.redirect('/one-login-start')
})

router.get('/check-teacher-reference-number', (req, res) => {
  const { hasTeacherReferenceNumber } = req.query

  if (hasTeacherReferenceNumber === 'no') {
    return res.redirect('/teacher-auth-no-teacher-reference-number.html')
  }

  return res.redirect('/teacher-auth-record-match')
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

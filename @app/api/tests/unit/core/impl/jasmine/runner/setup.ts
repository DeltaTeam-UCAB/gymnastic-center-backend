import '@mono/array-methods'
import '@mono/string-methods'
import '@mono/number-methods'
import '@mono/object-utils'
import '@mono/promise-methods'
import 'jasmine'

jasmine.getEnv().addReporter({
    jasmineStarted: function (suiteInfo) {
        console.log(
            'Running suite with ' + suiteInfo.totalSpecsDefined + ' tests',
        )
        console.log()
        console.log()
    },

    suiteStarted: function (result) {
        console.log('Suite started: ' + result.fullName)
        console.log()
    },

    specDone: function (result) {
        console.log('Test: ' + result.description + ' was ' + result.status)

        for (const expectation of result.failedExpectations) {
            console.log('Failure: ' + expectation.message)
            console.log(expectation.stack)
        }
        console.log()
    },

    suiteDone: function (result) {
        console.log('Suite: ' + result.description + ' was ' + result.status)
        for (const expectation of result.failedExpectations) {
            console.log('Suite ' + expectation.message)
            console.log(expectation.stack)
        }
        console.log()
        console.log()
    },

    jasmineDone: function (result) {
        console.log('Finished suite: ' + result.overallStatus)
        for (const expectation of result.failedExpectations) {
            console.log('Global ' + expectation.message)
            console.log(expectation.stack)
        }
    },
})

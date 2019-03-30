/**
 * fn to determine whether 2+ objects are of same/similar shape
 * - do they have the same keys?
 * -- Yes, and use exact
 * - is one object's keys a superset of the other object's keys?
 * -- Yes, and use shape of superset
 * --- If Yes, loop over the values of corresponding yes to determine the types
 * - are there 2 or more different keys in each object?
 *   (e.g. Object 1 has keys [1, 2, 3, 4], and Object 2 has keys [2, 3, 9, 7])
 * -- No, and use oneOfType(shape(object1), shape(object2))
 */

/**
 * fn to count the types of an array
 * (e.g. Array 1 has 2 string values, and 3 number values => { 'string': 2, 'number': 3 })
 * - could also return a `recommendation` and an array of `suggestions`
 * - in case of Array 1, recommendation would be oneOfType([string, number])
 * and recommendations would be string, number, any
 */

/**
 * eventually, each editable field will have the `recommended`
 * option by default, and several `suggestion` options as possibilities
 * that the user can change their choice to
 *
 * - each suggestion should always have `any` as the last suggestion
 * - each suggestion in which the value is an array or object should
 * always have array/object as the second-last choice
 * - essentially, the recommended choice is the most likely one
 * and following choices become either less likely or more general/less specific
 *
 * - each value should also be able to toggle whether or not the field is required
 * as well as quickly select the same for their children
 * - each object value in which `shape` is used should also allow the user to
 * choose `exact` and vice-versa
 * -- `shape` should be recommended when value is array of objects that are _similar_ but not _same_
 * -- `exact` should be recommended when value is array of objects that are _same_
 * -- `exact` should be recommended when value is object with specified keys
 * --- but in the case where the values of all the keys are the _same_, `objectOf` is the way to go
 * ---- if all the values of all the keys are the _same_ primitive, use the primitive
 * ---- if all the values of all the keys are multiple of the _same_ primitive
 * ---- if all the values of all the keys are the _same_ object, use `exact`
 * ---- if all the values of all the keys are _similar_ objects, use `shape`
 *
 * each field should also allow the user to override any recommendation/suggestion
 * with what they want (e.g. string even though the value is an object of numbers)
 *
 * each editable field should have
 * - state: value --> default value is the recommendation from props
 * - isRequiredEnabled: bool --> value is based on
 * -- 1. whether the user has checked the box specifically
 * -- 2. whether the user has checked the box on any of it's parents
 * -- 3. whether the user has checked the overall opt to always use isRequired
 * - prop: original_value --> the chunk of the overall value this field corresponds to
 * - prop: recommendation
 * - prop: []suggestions
 *
 */

/**
 * overall opts should be
 * - always/never use `isRequired`
 * - always/never use `shape` or `exact` -- eventually we'll wants these to be user guidelines
 */

/**
 * it would also be cool to be able to share the user's result
 * via a link, but this may require saving PT generations
 * in a database (which could also make this project more dope)
 */

/**
 * eventually, it would be cool to also do the same for TypeScript
 * example:
 * var type = {
 *  query: string | number
 * }
 */

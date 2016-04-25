import _get from 'lodash/get'
import _set from 'lodash/set'
import isEqual from 'lodash/isEqual'
import shouldUpdate from './shouldUpdate'
import createHelper from './createHelper'

const pick = (object, props) => {
  const propsArray = Array.isArray(props) ? props : [props]
  return propsArray.reduce((acc, key) => {
    _set(acc, key, _get(object, key))
    return acc
  }, {})
}

const onlyUpdateForKeys = propKeys => BaseComponent =>
  shouldUpdate(
    (props, nextProps) => !isEqual(
      pick(nextProps, propKeys),
      pick(props, propKeys)
    )
  )(BaseComponent)

export default createHelper(onlyUpdateForKeys, 'onlyUpdateForKeys')

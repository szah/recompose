import test from 'ava'
import React from 'react'
import { onlyUpdateForKeys, compose, withState } from '../'
import { mount } from 'enzyme'

test('onlyUpdateForKeys implements shouldComponentUpdate()', t => {
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    withState('nested', 'updateNested', { field: 0 }),
    onlyUpdateForKeys(['counter', 'nested.field'])
  )('div')

  t.is(Counter.displayName, 'withState(withState(withState(onlyUpdateForKeys(div))))')

  const div = mount(<Counter />).find('div')
  const { updateCounter, updateFoobar, updateNested } = div.props()

  t.is(div.prop('counter'), 0)
  t.is(div.prop('foobar'), 'foobar')
  t.is(div.prop('nested').field, 0)

  // Does not update
  updateFoobar('barbaz')
  t.is(div.prop('counter'), 0)
  t.is(div.prop('foobar'), 'foobar')
  t.is(div.prop('nested').field, 0)

  updateCounter(42)
  t.is(div.prop('counter'), 42)
  t.is(div.prop('foobar'), 'barbaz')
  t.is(div.prop('nested').field, 0)

  updateNested({ field: 1 })
  t.is(div.prop('counter'), 42)
  t.is(div.prop('foobar'), 'barbaz')
  t.is(div.prop('nested').field, 1)
})

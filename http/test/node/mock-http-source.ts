import 'mocha';
import * as assert from 'assert';
import {mockHTTPDriver, RequestOptions} from '../../src/index';
import xs from 'xstream';
import {setup} from '../../../run/src';

describe.only('mockHTTPDriver', function() {
  it('works', function(done) {
    function main(sources: any) {
      return {
        HTTP: xs.of('some request'),
        response$: sources.HTTP.select().flatten(),
      };
    }

    const drivers = {
      HTTP: mockHTTPDriver(request => ({text: 'hi', status: 200})),
    };

    const {sinks, run} = setup(main, drivers);

    const dispose = run();

    sinks.response$.take(1).addListener({
      next (ev: any) {
        assert.equal(ev.text, 'hi')
        assert.equal(ev.status, 200)

        dispose();
        done();
      },

      error: done
    });
  });
});
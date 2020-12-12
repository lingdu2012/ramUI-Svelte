
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Container.svelte generated by Svelte v3.31.0 */

    const file = "src\\components\\Container.svelte";

    function create_fragment(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "container" + /*mtype*/ ctx[1]);
    			attr_dev(div, "style", /*style*/ ctx[0]);
    			add_location(div, file, 10, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*mtype*/ 2 && div_class_value !== (div_class_value = "container" + /*mtype*/ ctx[1])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 1) {
    				attr_dev(div, "style", /*style*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Container", slots, ['default']);
    	let { type = "" } = $$props;
    	let { style = "" } = $$props;
    	let mtype = "";
    	const writable_props = ["type", "style"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, style, mtype });

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(2, type = $$props.type);
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    		if ("mtype" in $$props) $$invalidate(1, mtype = $$props.mtype);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*type*/ 4) {
    			 if (type) {
    				$$invalidate(1, mtype = "-" + type);
    			}
    		}
    	};

    	return [style, mtype, type, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { type: 2, style: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get type() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Row.svelte generated by Svelte v3.31.0 */

    const file$1 = "src\\components\\Row.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "row " + /*exClass*/ ctx[1] + " " + /*gutter*/ ctx[2]);
    			attr_dev(div, "style", /*style*/ ctx[0]);
    			add_location(div, file$1, 6, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*exClass, gutter*/ 6 && div_class_value !== (div_class_value = "row " + /*exClass*/ ctx[1] + " " + /*gutter*/ ctx[2])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 1) {
    				attr_dev(div, "style", /*style*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Row", slots, ['default']);
    	let { style = "" } = $$props;
    	let { exClass = "" } = $$props;
    	let { gutter = "" } = $$props;
    	const writable_props = ["style", "exClass", "gutter"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    		if ("exClass" in $$props) $$invalidate(1, exClass = $$props.exClass);
    		if ("gutter" in $$props) $$invalidate(2, gutter = $$props.gutter);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ style, exClass, gutter });

    	$$self.$inject_state = $$props => {
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    		if ("exClass" in $$props) $$invalidate(1, exClass = $$props.exClass);
    		if ("gutter" in $$props) $$invalidate(2, gutter = $$props.gutter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [style, exClass, gutter, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { style: 0, exClass: 1, gutter: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get style() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get exClass() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set exClass(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gutter() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gutter(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Col.svelte generated by Svelte v3.31.0 */

    const file$2 = "src\\components\\Col.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "col" + /*mRowNum*/ ctx[1]);
    			attr_dev(div, "style", /*style*/ ctx[0]);
    			add_location(div, file$2, 9, 0, 128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*mRowNum*/ 2 && div_class_value !== (div_class_value = "col" + /*mRowNum*/ ctx[1])) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 1) {
    				attr_dev(div, "style", /*style*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Col", slots, ['default']);
    	let { style = "" } = $$props;
    	let { rowNum = "" } = $$props;
    	let mRowNum = "";
    	const writable_props = ["style", "rowNum"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Col> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    		if ("rowNum" in $$props) $$invalidate(2, rowNum = $$props.rowNum);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ style, rowNum, mRowNum });

    	$$self.$inject_state = $$props => {
    		if ("style" in $$props) $$invalidate(0, style = $$props.style);
    		if ("rowNum" in $$props) $$invalidate(2, rowNum = $$props.rowNum);
    		if ("mRowNum" in $$props) $$invalidate(1, mRowNum = $$props.mRowNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rowNum*/ 4) {
    			 if (rowNum) {
    				$$invalidate(1, mRowNum = "-" + rowNum);
    			}
    		}
    	};

    	return [style, mRowNum, rowNum, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { style: 0, rowNum: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get style() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowNum() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowNum(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Table.svelte generated by Svelte v3.31.0 */

    const file$3 = "src\\components\\Table.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    const get_tbody_slot_changes = dirty => ({});
    const get_tbody_slot_context = ctx => ({});

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    const get_thead_slot_changes = dirty => ({});
    const get_thead_slot_context = ctx => ({});

    // (10:8) {#if ths}
    function create_if_block_1(ctx) {
    	let thead;
    	let tr;
    	let each_value_2 = /*ths*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$3, 11, 16, 231);
    			add_location(thead, file$3, 10, 12, 206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ths*/ 4) {
    				each_value_2 = /*ths*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(10:8) {#if ths}",
    		ctx
    	});

    	return block;
    }

    // (13:20) {#each ths as item}
    function create_each_block_2(ctx) {
    	let th;
    	let t_value = /*item*/ ctx[9] + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			add_location(th, file$3, 13, 24, 302);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ths*/ 4 && t_value !== (t_value = /*item*/ ctx[9] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(13:20) {#each ths as item}",
    		ctx
    	});

    	return block;
    }

    // (9:21)           
    function fallback_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*ths*/ ctx[2] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*ths*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(9:21)           ",
    		ctx
    	});

    	return block;
    }

    // (21:8) {#if data}
    function create_if_block(ctx) {
    	let tbody;
    	let each_value = /*data*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tbody, file$3, 21, 8, 470);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cols, data*/ 10) {
    				each_value = /*data*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:8) {#if data}",
    		ctx
    	});

    	return block;
    }

    // (25:20) {#each cols as item}
    function create_each_block_1(ctx) {
    	let td;
    	let t_value = /*child*/ ctx[6][/*item*/ ctx[9]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			add_location(td, file$3, 25, 24, 602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, cols*/ 10 && t_value !== (t_value = /*child*/ ctx[6][/*item*/ ctx[9]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(25:20) {#each cols as item}",
    		ctx
    	});

    	return block;
    }

    // (23:12) {#each data as child}
    function create_each_block(ctx) {
    	let tr;
    	let t;
    	let each_value_1 = /*cols*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$3, 23, 16, 530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, cols*/ 10) {
    				each_value_1 = /*cols*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:12) {#each data as child}",
    		ctx
    	});

    	return block;
    }

    // (20:21)           
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*data*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(20:21)           ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let table;
    	let t;
    	let table_class_value;
    	let current;
    	const thead_slot_template = /*#slots*/ ctx[5].thead;
    	const thead_slot = create_slot(thead_slot_template, ctx, /*$$scope*/ ctx[4], get_thead_slot_context);
    	const thead_slot_or_fallback = thead_slot || fallback_block_1(ctx);
    	const tbody_slot_template = /*#slots*/ ctx[5].tbody;
    	const tbody_slot = create_slot(tbody_slot_template, ctx, /*$$scope*/ ctx[4], get_tbody_slot_context);
    	const tbody_slot_or_fallback = tbody_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (thead_slot_or_fallback) thead_slot_or_fallback.c();
    			t = space();
    			if (tbody_slot_or_fallback) tbody_slot_or_fallback.c();
    			attr_dev(table, "class", table_class_value = "table " + /*exClass*/ ctx[0]);
    			add_location(table, file$3, 7, 0, 119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (thead_slot_or_fallback) {
    				thead_slot_or_fallback.m(table, null);
    			}

    			append_dev(table, t);

    			if (tbody_slot_or_fallback) {
    				tbody_slot_or_fallback.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (thead_slot) {
    				if (thead_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(thead_slot, thead_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_thead_slot_changes, get_thead_slot_context);
    				}
    			} else {
    				if (thead_slot_or_fallback && thead_slot_or_fallback.p && dirty & /*ths*/ 4) {
    					thead_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (tbody_slot) {
    				if (tbody_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(tbody_slot, tbody_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_tbody_slot_changes, get_tbody_slot_context);
    				}
    			} else {
    				if (tbody_slot_or_fallback && tbody_slot_or_fallback.p && dirty & /*data, cols*/ 10) {
    					tbody_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*exClass*/ 1 && table_class_value !== (table_class_value = "table " + /*exClass*/ ctx[0])) {
    				attr_dev(table, "class", table_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(thead_slot_or_fallback, local);
    			transition_in(tbody_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(thead_slot_or_fallback, local);
    			transition_out(tbody_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (thead_slot_or_fallback) thead_slot_or_fallback.d(detaching);
    			if (tbody_slot_or_fallback) tbody_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, ['thead','tbody']);
    	let { exClass = "" } = $$props;
    	let { data = [] } = $$props;
    	let { ths } = $$props;
    	let { cols } = $$props;
    	const writable_props = ["exClass", "data", "ths", "cols"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("exClass" in $$props) $$invalidate(0, exClass = $$props.exClass);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("ths" in $$props) $$invalidate(2, ths = $$props.ths);
    		if ("cols" in $$props) $$invalidate(3, cols = $$props.cols);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ exClass, data, ths, cols });

    	$$self.$inject_state = $$props => {
    		if ("exClass" in $$props) $$invalidate(0, exClass = $$props.exClass);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("ths" in $$props) $$invalidate(2, ths = $$props.ths);
    		if ("cols" in $$props) $$invalidate(3, cols = $$props.cols);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [exClass, data, ths, cols, $$scope, slots];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { exClass: 0, data: 1, ths: 2, cols: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ths*/ ctx[2] === undefined && !("ths" in props)) {
    			console.warn("<Table> was created without expected prop 'ths'");
    		}

    		if (/*cols*/ ctx[3] === undefined && !("cols" in props)) {
    			console.warn("<Table> was created without expected prop 'cols'");
    		}
    	}

    	get exClass() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set exClass(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ths() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ths(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.31.0 */
    const file$4 = "src\\App.svelte";

    // (31:8) <RamCol rowNum="3">
    function create_default_slot_5(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Primary";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$4, 30, 27, 759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(31:8) <RamCol rowNum=\\\"3\\\">",
    		ctx
    	});

    	return block;
    }

    // (32:8) <RamCol rowNum="3">
    function create_default_slot_4(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Secondary";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-secondary");
    			add_location(button, file$4, 31, 27, 858);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(32:8) <RamCol rowNum=\\\"3\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:8) <RamCol>
    function create_default_slot_3(ctx) {
    	let button0;
    	let t1;
    	let button1;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Success";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Danger";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-success");
    			add_location(button0, file$4, 32, 16, 950);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-danger");
    			add_location(button1, file$4, 33, 8, 1021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(33:8) <RamCol>",
    		ctx
    	});

    	return block;
    }

    // (30:5) <RamRow exClass="row-cols-auto">
    function create_default_slot_2(ctx) {
    	let ramcol0;
    	let t0;
    	let ramcol1;
    	let t1;
    	let ramcol2;
    	let current;

    	ramcol0 = new Col({
    			props: {
    				rowNum: "3",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	ramcol1 = new Col({
    			props: {
    				rowNum: "3",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	ramcol2 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ramcol0.$$.fragment);
    			t0 = space();
    			create_component(ramcol1.$$.fragment);
    			t1 = space();
    			create_component(ramcol2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ramcol0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(ramcol1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(ramcol2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ramcol0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				ramcol0_changes.$$scope = { dirty, ctx };
    			}

    			ramcol0.$set(ramcol0_changes);
    			const ramcol1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				ramcol1_changes.$$scope = { dirty, ctx };
    			}

    			ramcol1.$set(ramcol1_changes);
    			const ramcol2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				ramcol2_changes.$$scope = { dirty, ctx };
    			}

    			ramcol2.$set(ramcol2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ramcol0.$$.fragment, local);
    			transition_in(ramcol1.$$.fragment, local);
    			transition_in(ramcol2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ramcol0.$$.fragment, local);
    			transition_out(ramcol1.$$.fragment, local);
    			transition_out(ramcol2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ramcol0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(ramcol1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(ramcol2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(30:5) <RamRow exClass=\\\"row-cols-auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:8) <thead slot="thead">
    function create_thead_slot(ctx) {
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "#";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "First";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Last";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Handle";
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$4, 39, 16, 1192);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$4, 40, 16, 1231);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$4, 41, 16, 1274);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$4, 42, 16, 1316);
    			add_location(tr, file$4, 38, 12, 1171);
    			attr_dev(thead, "slot", "thead");
    			add_location(thead, file$4, 37, 8, 1138);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_thead_slot.name,
    		type: "slot",
    		source: "(38:8) <thead slot=\\\"thead\\\">",
    		ctx
    	});

    	return block;
    }

    // (46:8) <tbody slot="tbody">
    function create_tbody_slot(ctx) {
    	let tbody;
    	let tr0;
    	let th0;
    	let t1;
    	let td0;
    	let t3;
    	let td1;
    	let t5;
    	let td2;
    	let t7;
    	let tr1;
    	let th1;
    	let t9;
    	let td3;
    	let t11;
    	let td4;
    	let t13;
    	let td5;
    	let t15;
    	let tr2;
    	let th2;
    	let t17;
    	let td6;
    	let t19;
    	let td7;

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "1";
    			t1 = space();
    			td0 = element("td");
    			td0.textContent = "Mark";
    			t3 = space();
    			td1 = element("td");
    			td1.textContent = "Otto";
    			t5 = space();
    			td2 = element("td");
    			td2.textContent = "@mdo";
    			t7 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			th1.textContent = "2";
    			t9 = space();
    			td3 = element("td");
    			td3.textContent = "Jacob";
    			t11 = space();
    			td4 = element("td");
    			td4.textContent = "Thornton";
    			t13 = space();
    			td5 = element("td");
    			td5.textContent = "@fat";
    			t15 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			th2.textContent = "3";
    			t17 = space();
    			td6 = element("td");
    			td6.textContent = "Larry the Bird";
    			t19 = space();
    			td7 = element("td");
    			td7.textContent = "@twitter";
    			attr_dev(th0, "scope", "row");
    			add_location(th0, file$4, 47, 16, 1441);
    			add_location(td0, file$4, 48, 16, 1480);
    			add_location(td1, file$4, 49, 16, 1510);
    			add_location(td2, file$4, 50, 16, 1540);
    			add_location(tr0, file$4, 46, 12, 1420);
    			attr_dev(th1, "scope", "row");
    			add_location(th1, file$4, 53, 16, 1609);
    			add_location(td3, file$4, 54, 16, 1648);
    			add_location(td4, file$4, 55, 16, 1679);
    			add_location(td5, file$4, 56, 16, 1713);
    			add_location(tr1, file$4, 52, 16, 1588);
    			attr_dev(th2, "scope", "row");
    			add_location(th2, file$4, 59, 16, 1786);
    			attr_dev(td6, "colspan", "2");
    			add_location(td6, file$4, 60, 16, 1825);
    			add_location(td7, file$4, 61, 16, 1877);
    			add_location(tr2, file$4, 58, 16, 1765);
    			attr_dev(tbody, "slot", "tbody");
    			add_location(tbody, file$4, 45, 8, 1387);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td0);
    			append_dev(tr0, t3);
    			append_dev(tr0, td1);
    			append_dev(tr0, t5);
    			append_dev(tr0, td2);
    			append_dev(tbody, t7);
    			append_dev(tbody, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t9);
    			append_dev(tr1, td3);
    			append_dev(tr1, t11);
    			append_dev(tr1, td4);
    			append_dev(tr1, t13);
    			append_dev(tr1, td5);
    			append_dev(tbody, t15);
    			append_dev(tbody, tr2);
    			append_dev(tr2, th2);
    			append_dev(tr2, t17);
    			append_dev(tr2, td6);
    			append_dev(tr2, t19);
    			append_dev(tr2, td7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tbody_slot.name,
    		type: "slot",
    		source: "(46:8) <tbody slot=\\\"tbody\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:4) <RamTable>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(37:4) <RamTable>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <RamContainer type="fluid">
    function create_default_slot(ctx) {
    	let ramrow;
    	let t0;
    	let ramtable0;
    	let t1;
    	let ramtable1;
    	let t2;
    	let ramtable2;
    	let current;

    	ramrow = new Row({
    			props: {
    				exClass: "row-cols-auto",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	ramtable0 = new Table({
    			props: {
    				$$slots: {
    					default: [create_default_slot_1],
    					tbody: [create_tbody_slot],
    					thead: [create_thead_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	ramtable1 = new Table({
    			props: {
    				ths: /*ths*/ ctx[1],
    				cols: /*cols*/ ctx[2],
    				data: /*data*/ ctx[3],
    				exClass: "table-striped"
    			},
    			$$inline: true
    		});

    	ramtable2 = new Table({
    			props: {
    				ths: /*ths*/ ctx[1],
    				cols: /*cols2*/ ctx[4],
    				data: /*data2*/ ctx[5],
    				exClass: "table-hover"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ramrow.$$.fragment);
    			t0 = space();
    			create_component(ramtable0.$$.fragment);
    			t1 = space();
    			create_component(ramtable1.$$.fragment);
    			t2 = space();
    			create_component(ramtable2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ramrow, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(ramtable0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(ramtable1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(ramtable2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ramrow_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				ramrow_changes.$$scope = { dirty, ctx };
    			}

    			ramrow.$set(ramrow_changes);
    			const ramtable0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				ramtable0_changes.$$scope = { dirty, ctx };
    			}

    			ramtable0.$set(ramtable0_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ramrow.$$.fragment, local);
    			transition_in(ramtable0.$$.fragment, local);
    			transition_in(ramtable1.$$.fragment, local);
    			transition_in(ramtable2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ramrow.$$.fragment, local);
    			transition_out(ramtable0.$$.fragment, local);
    			transition_out(ramtable1.$$.fragment, local);
    			transition_out(ramtable2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ramrow, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(ramtable0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(ramtable1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(ramtable2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(29:4) <RamContainer type=\\\"fluid\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let ramcontainer;
    	let current;

    	ramcontainer = new Container({
    			props: {
    				type: "fluid",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Hello ,");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text("!");
    			t3 = space();
    			create_component(ramcontainer.$$.fragment);
    			add_location(h1, file$4, 27, 1, 638);
    			add_location(main, file$4, 26, 0, 630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(main, t3);
    			mount_component(ramcontainer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			const ramcontainer_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				ramcontainer_changes.$$scope = { dirty, ctx };
    			}

    			ramcontainer.$set(ramcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ramcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ramcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(ramcontainer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { name } = $$props;
    	let ths = ["序号", "姓名", "学号"];
    	let cols = [0, 1, 2];
    	let data = [[1, "张三", "10001"], [2, "李四", "10002"]];
    	let cols2 = ["ind", "username", "nums"];

    	let data2 = [
    		{ ind: 1, username: "小明", nums: "10003" },
    		{ ind: 2, username: "小红", nums: "10004" }
    	];

    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		RamContainer: Container,
    		RamRow: Row,
    		RamCol: Col,
    		RamTable: Table,
    		name,
    		ths,
    		cols,
    		data,
    		cols2,
    		data2
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("ths" in $$props) $$invalidate(1, ths = $$props.ths);
    		if ("cols" in $$props) $$invalidate(2, cols = $$props.cols);
    		if ("data" in $$props) $$invalidate(3, data = $$props.data);
    		if ("cols2" in $$props) $$invalidate(4, cols2 = $$props.cols2);
    		if ("data2" in $$props) $$invalidate(5, data2 = $$props.data2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, ths, cols, data, cols2, data2];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'RamUI-Svelte-Bootstrap'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

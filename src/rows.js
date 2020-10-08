/*
 * Whenever a new row is created each cell <td> is initialized with two values:
 *    td.data = the original supplied Object (this value should not change)
 *    td.innerHTML = String rendered from td.data
 */

import {createElement, isIterable} from "./helpers"
/**
 * Rows API
 * @param {Object} instance DataTable instance
 * @param {Array} rows
 */
export class Rows {
    constructor(dt, rows) {
        this.dt = dt
        this.rows = rows

        return this
    }

    /**
     * Build a new row
     * @param  {Array} row -- An Array of objects
     * @return {HTMLElement}
     */
    build(row) {
        const tr = createElement("tr")

        let headings = this.dt.headings

        if (!headings.length) {
            headings = row.map(() => "")
        }

        headings.forEach((h, i) => {
            const td = createElement("td")

            td.data = row[i]

            const renderer = this.dt.renderers[i]
            td.innerHTML = renderer? renderer.call(this, td.data, td, tr) : td.data

            tr.appendChild(td)
        })

        return tr
    }

    render(row) {
        return row
    }

    /**
     * Add new row(s) to this DataTable
     * @param {Iterable} rowData -- A single row (Array) or an Iterable of rows
     */
    add(rowData) {
        if (!isIterable(rowData)) {
            throw new TypeError("rowData must be an Array or iterable")
        }

        const dt = this.dt

        if (rowData.length) {

            // rowData is a single row Array
            dt.data.push(this.build(rowData))

        } else {

            // rowData is an iterable of row Arrays
            for (const row of rowData) {
                dt.data.push(this.build(row))
            }
        }

        // We may have added data to an empty table
        if ( dt.data.length ) {
            dt.hasRows = true
        }

        this.update()
        dt.columns().rebuild()

    }

    /**
     * Remove row(s)
     * @param  {Iterable|Number} select -- An index (Number) or iterable of indexes of rows to remove
     */
    remove(select) {
        const dt = this.dt

        if (isIterable(select)) {
            for (const idx of select) {
                dt.data[idx] = null
            }
            dt.data = dt.data.filter(el => el)

        } else if (select == 'all') {
            dt.data = [];
        } else {
            dt.data.splice(select, 1)
        }

        // We may have emptied the table
        if ( !dt.data.length ) {
            dt.hasRows = false
        }

        this.update()
        dt.columns().rebuild()
    }

    /**
     * Update row indexes
     * @return {Void}
     */
    update() {
        this.dt.data.forEach((row, i) => {
            row.dataIndex = i
        })
    }
}

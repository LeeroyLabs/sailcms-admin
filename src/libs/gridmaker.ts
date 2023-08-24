export class GridMaker
{
    private list: any[] = [];
    private gridRows: any[] = [[]];
    private rowIndex: number = 0;

    constructor(list: any[])
    {
        this.list = list;
    }

    public make(): any[]
    {
        // Reset
        this.gridRows = [[]];
        this.rowIndex = 0;

        for (const [idx, item] of this.list.entries()) {
            // check if row has space by checking each item in it and measuring
            if (this.currentGridRowHasSpaceFor(item.width)) {
                this.gridRows[this.rowIndex].push(item);
            } else {
                // Close row and open new one
                this.rowIndex++;
                this.gridRows.push([]);

                // Now add
                this.gridRows[this.rowIndex].push(item);
            }
        }

        return this.gridRows;
    }

    private currentGridRowHasSpaceFor(size: string): boolean
    {
        const currentRowCount = this.gridRows[this.rowIndex].length;

        let allowed = true;
        let halfCount = 0;
        let thirdCount = 0;

        switch(size)
        {
            default:
            case 'full':
                return (currentRowCount === 0);

            case 'half':
                for (const rowItem of this.gridRows[this.rowIndex]) {
                    if (rowItem.width === 'half') halfCount++;
                    if (rowItem.width === 'third') thirdCount++;

                    // 1 full
                    if (rowItem.width === 'full') allowed = false;

                    // 2 halves
                    if (halfCount === 2) allowed = false;

                    // 1 third and 1 half
                    if (halfCount === 1 && thirdCount === 1) allowed = false;

                    // more than 1 third
                    if (thirdCount > 1) allowed = false;
                }

                return allowed;

            case 'third':
                for (const rowItem of this.gridRows[this.rowIndex]) {
                    if (rowItem.width === 'half') halfCount++;
                    if (rowItem.width === 'third') thirdCount++;

                    // 1 full
                    if (rowItem.width === 'full') allowed = false;

                    // 2 halves
                    if (halfCount === 2) allowed = false;

                    // 3 thirds
                    if (thirdCount === 3) allowed = false;

                    // 1 third + 1 half
                    if (thirdCount === 1 && halfCount === 1) allowed = false;
                }

                return allowed;
        }
    }
}

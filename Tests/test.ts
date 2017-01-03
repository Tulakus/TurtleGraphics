import 'jasmine';

module pokus{
    describe('test', ()=>{
        it('Create word whit life cells when seed is specified', () =>{
            expect(true).toBe.tr        world = new World([new Cell(1, 1), new Cell(1, 2)]);
                    expect(world.lifeCells).toEqual([new Cell(1, 1), new Cell(1, 2)]);
        });
    })
}

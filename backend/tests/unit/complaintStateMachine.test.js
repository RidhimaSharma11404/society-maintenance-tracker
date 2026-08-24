const Complaint = require('../../src/models/Complaint');

describe('Finite State Machine (FSM) Lifecycle Transition Rules', () => {
  test('Should define allowed transitions according to strict corporate workflow', () => {
    expect(Complaint.getValidTransitions('Open')).toEqual(['In Progress', 'Resolved']);
    expect(Complaint.getValidTransitions('In Progress')).toEqual(['Resolved', 'Open']);
    expect(Complaint.getValidTransitions('Resolved')).toEqual(['Closed', 'In Progress']);
    expect(Complaint.getValidTransitions('Closed')).toEqual([]);
  });

  test('Should allow legal forward progression: Open -> In Progress -> Resolved -> Closed', () => {
    const transitions = [
      { from: 'Open', to: 'In Progress' },
      { from: 'In Progress', to: 'Resolved' },
      { from: 'Resolved', to: 'Closed' }
    ];

    transitions.forEach(({ from, to }) => {
      const allowed = Complaint.getValidTransitions(from);
      expect(allowed).toContain(to);
    });
  });

  test('Should reject illegal direct jump from Open to Closed', () => {
    const allowed = Complaint.getValidTransitions('Open');
    expect(allowed).not.toContain('Closed');
  });

  test('Should reject illegal transition out of terminal Closed state', () => {
    const allowed = Complaint.getValidTransitions('Closed');
    expect(allowed).toHaveLength(0);
    expect(allowed).not.toContain('Open');
    expect(allowed).not.toContain('In Progress');
    expect(allowed).not.toContain('Resolved');
  });

  test('Should allow fallback/re-inspection transitions (In Progress -> Open, Resolved -> In Progress)', () => {
    expect(Complaint.getValidTransitions('In Progress')).toContain('Open');
    expect(Complaint.getValidTransitions('Resolved')).toContain('In Progress');
  });
});

import { App, WorkspaceLeaf } from "obsidian";

export async function getLeaf(app: App, viewType: string, split: boolean = true) : Promise<WorkspaceLeaf> {
  const { workspace } = app
  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(viewType);

  if (leaves.length > 0) {
      leaf = leaves[0];
  } else {
      leaf = workspace.getLeaf(split);
      await leaf?.setViewState({ type: viewType, active: false});
  }

  return leaf;
}

export async function getRightLeaf(
  app: App, 
  viewType: string,
  state: any = {},
  split: boolean = true): Promise<WorkspaceLeaf|null> 
{
  const { workspace } = app
  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(viewType);

  if (leaves.length > 0) {
      leaf = leaves[0];
  } else {
      leaf = workspace.getRightLeaf(split);
  }
  await leaf?.setViewState({ type: viewType, active: true, state: state});
  return leaf;
}

export async function createLeafInNewGroup(
    app: App,
    viewType: string,
    state: any = {}) 
    {
    const { workspace } = app
    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(viewType);

    if (leaves.length > 0) {
        leaf = leaves[0];
    } else {
        leaf = workspace.createLeafBySplit(workspace.getLeaf(), 'vertical');
    }
    await leaf?.setViewState({ type: viewType, active: true, state: state });
    return leaf;
}

export async function replaceOrCreateRightLeaf(
  app: App, 
  viewType: string,
  state: any = {},
  split: boolean = true): Promise<WorkspaceLeaf|null> 
{
  const { workspace } = app
  let leaf: WorkspaceLeaf | null = null;
  const leaves = workspace.getLeavesOfType(viewType);
  for (let leaf of leaves) {
      leaf.detach();
  }
  
  leaf = workspace.getRightLeaf(split);
  
  await leaf?.setViewState({ type: viewType, active: true, state: state});
  return leaf;
}

export function detachLeavesOfTypes(app: App, viewTypes: Array<string>): void {
  for (var viewType of viewTypes) {
    app.workspace.detachLeavesOfType(viewType);
  }
}

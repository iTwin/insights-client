/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { PagedResponseLinks } from "../interfaces/Links";

export interface collection {
  values: Array<any>;
  _links: PagedResponseLinks;
}

export interface EntityCollectionPage<TEntity> {
  /** Current page entities. */
  entities: TEntity[];
  /** Function to retrieve the next page of the entities. If `undefined` the current page is last. */
  next?: () => Promise<EntityCollectionPage<TEntity>>;
}

export type EntityPageQueryFunc<TEntity> = () => Promise<EntityCollectionPage<TEntity>>;

export async function* flatten<TEntity>(pagedIterator: AsyncIterableIterator<TEntity[]>): AsyncIterableIterator<TEntity> {
  for await (const entityChunk of pagedIterator) {
    for (const entity of entityChunk)
      yield entity;
  }
}

export async function getEntityCollectionPage<TEntity>(
  nextUrl: string,
  requestOptions: RequestInit,
  getNextBatch: (url: string, requestOptions: RequestInit) => Promise<collection>
): Promise<EntityCollectionPage<TEntity>> {
  const response: collection = await getNextBatch(nextUrl, requestOptions);
  return {
    entities: response.values,
    next: response._links.next ? async () => getEntityCollectionPage<TEntity>(response._links.next!.href!, requestOptions, getNextBatch) : undefined
  };
}
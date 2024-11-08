/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/**
 * Creates a promise that when awaited will result in the provided time delay.
 * @param duration Duration of the needed delay in milliseconds.
 */
export async function delay(duration: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

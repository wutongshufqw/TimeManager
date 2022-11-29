import React from "react";

export interface AoeRelationItemProps {
    num: number,
    id: string,
    parentId?: string,
    parent?: string,
    childId?: string,
    child?: string,
    day: number,
    hour: number,
    content: string
    groupId: string,
}

export function AoeRelationItem({
                                    num,
                                    id,
                                    parent,
                                    child,
                                    day,
                                    hour,
                                    content,
                                    groupId,
                                }: AoeRelationItemProps) {
    return (
        <>
            <tr className="items-center hover">
                <th className="text-center">{num}</th>
                <td className="text-center">{parent}</td>
                <td className="text-center">{child}</td>
                <td className="text-center"> {day} 天 {hour} 时 </td>
                <td className="text-center">{content}</td>
                <td className="text-center">
                    <form action="aoe/relationDao" method="post">
                        <input name="groupId" defaultValue={groupId} className="hidden"/>
                        <input name="id" defaultValue={id} className="hidden"/>
                        <button type="submit" name="_action" value="delete" className="btn btn-sm btn-error w-24">删除</button>
                    </form>
                </td>
            </tr>
        </>
    );
}
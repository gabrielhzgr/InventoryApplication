CREATE FUNCTION createModel(descr text, brandId numeric, demoId numeric, tags numeric[])
RETURNS INTEGER
language plpgsql
AS
$$
DECLARE 
    myId INTEGER;
    tag INTEGER;
BEGIN
    INSERT INTO models(description, brand_id, demo_id) VALUES (descr, brandId, demoId) RETURNING id INTO myId;
    FOREACH tag IN ARRAY tags
    LOOP 
        INSERT INTO models_tags VALUES(myId, tag);
    END LOOP;   

    RETURN myId;  
END;
$$;

CREATE FUNCTION updateModel(myId numeric,descr text, brandId numeric, demoId numeric, tags numeric[])
RETURNS INTEGER
language plpgsql
AS
$$
DECLARE
    tag INTEGER;
BEGIN
    UPDATE models SET(description, brand_id, demo_id) = (descr, brandId, demoId) WHERE id=myId;
    DELETE FROM models_tags WHERE model_id=myId;
    FOREACH tag IN ARRAY tags
    LOOP 
        INSERT INTO models_tags VALUES(myId, tag);
    END LOOP;   

    RETURN myId;  
END;
$$;
